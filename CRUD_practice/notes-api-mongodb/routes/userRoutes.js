const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  refreshUserToken,
  logoutUser,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/refresh-token", refreshUserToken);
router.post("/logout", logoutUser);

module.exports = router;
