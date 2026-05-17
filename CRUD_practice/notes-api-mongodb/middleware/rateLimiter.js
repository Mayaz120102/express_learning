const rateLimit = require("express-rate-limit");

// 🔥 login limiter (STRICT)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // only 5 requests allowed
  message: {
    success: false,
    message: "Too many login attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔥 global API limiter (NORMAL)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // 100 requests per IP
});

module.exports = { loginLimiter, apiLimiter };
