const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//token generating

//access token =short life
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

//refresh token = long life
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  //checking user exist or not
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User Already exists");
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // generate tokens
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.status(201).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
  });
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validation
  if (!email || !password) {
    res.status(400);
    throw new Error("all fields are required");
  }

  //check user
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  //compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.status(400);
    throw new Error("Invalid credentials");
  }

  //generate token
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  //save refresh token in db
  user.refreshToken = refreshToken;
  await user.save();

  //setting refreshtoken in cookie for production level
  res.cookie("refreshToken", refreshToken, cookieOptions);

  //send only access in response
  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken,
  });
});

const refreshUserToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  //check refreh token exists
  if (!refreshToken) {
    res.status(401);
    throw new Error("No refresh token provided");
  }

  try {
    // verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // find user
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      res.status(403);
      throw new Error("Invalid refresh token");
    }

    // generate new access token
    const newAccessToken = generateAccessToken(user._id);

    // OPTIONAL:
    // refresh token rotation (recommended)
    const newRefreshToken = generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    // set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, cookieOptions);

    // send access token
    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(401);
    throw new Error("Invalid refresh token");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // remove refresh token from DB
  if (refreshToken) {
    const user = await User.findOne({ refreshToken });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }
  }

  // clear cookie
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({
    message: "Logged out successfully",
  });
});

module.exports = {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
};
