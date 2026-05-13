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

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

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

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("all fields are required");
  }

  //check user
  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Invalid credentails");
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
  // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  //   expiresIn: "30d",
  // });
  //save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    accessToken,
    refreshToken,
  });
});

const refreshUserToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401);
    throw new Error("No refresh token provided");
  }

  //find user with this token
  const user = await User.findOne({ refreshToken });

  if (!user) {
    res.status(403);
    throw new Error("Invalid refresh token");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = generateAccessToken(decoded.id);

    res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(401);
    throw new Error("invalid refresh token");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const user = await User.findOne({ refreshToken });

  if (user) {
    user.refreshToken = null;
    await user.save();
  }
  res.status(200).json({ message: "logged out successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
};
