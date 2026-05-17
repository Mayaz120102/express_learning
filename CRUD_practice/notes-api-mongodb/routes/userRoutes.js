const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
} = require("../controllers/userController");

const { body } = require("express-validator");
const validate = require("../middleware/validateMiddleware");
const { loginLimiter } = require("../middleware/rateLimiter");

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),

    body("email").isEmail().withMessage("Valid email required"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6"),
  ],
  validate,
  registerUser,
);

router.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Valid email required"),

    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  loginUser,
);

router.post("/refresh-token", refreshUserToken);
router.post("/logout", logoutUser);

module.exports = router;
