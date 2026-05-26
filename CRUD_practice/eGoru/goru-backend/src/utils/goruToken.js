import jwt from "jsonwebtoken";

export const goruGenerateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const goruVerifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
