import { goruVerifyToken } from "../utils/goruToken.js";
import GoruUser from "../models/GoruUser.js";

export const goruProtect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized- no token provided",
      });
    }

    const decoded = goruVerifyToken(token);

    req.goruUser = await GoruUser.findById(decoded.id).select("-password");

    if (!req.goruUser) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired",
    });
  }
};

export const goruRestrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.goruUser.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied -${req.goruUser.role}s cannot do this`,
      });
    }
    next();
  };
};
