import GoruUser from "../models/GoruUser.js";
import { goruGenerateToken } from "../utils/goruToken.js";

const goruSendTokenResponse = (user, statusCode, res) => {
  const token = goruGenerateToken(user._id);

  const userData = user.toObject();
  delete userData.password;

  res.status(statusCode).json({
    success: true,
    token,
    user: userData,
  });
};

//register
export const goruRegister = async (req, res) => {
  try {
    const { name, email, password, role, phone, district } = req.body;

    const existingUser = await GoruUser.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }
    console.log("About to create user:", { name, email, role });
    const user = await GoruUser.create({
      name,
      email,
      password,
      role: role || "buyer",
      phone,
      district,
    });
    console.log("User created successfully:", user._id);
    goruSendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//login
export const goruLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please email and password",
      });
    }

    //find user and include password
    const user = await GoruUser.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.goruComparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    goruSendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const goruGetMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.goruUser,
  });
};
