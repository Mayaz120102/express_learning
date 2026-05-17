const errorHandler = require("./middleware/errorMiddleware");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { apiLimiter } = require("./middleware/rateLimiter");
const helmet = require("helmet");

dotenv.config(); //laod env

const app = express();

// allowed frontend URLs
const allowedOrigins = [process.env.CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// security headers
app.use(helmet());

//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//connect database
connectDB();

//routse importt
const noteRoutes = require("./routes/noteRouters");
const userRoutes = require("./routes/userRoutes");

//rate limiter
app.use("/api", apiLimiter);

//router middleware /api routes
app.use("/api/notes", noteRoutes);
app.use("/api/users/", userRoutes);

//test route
app.get("/", (req, res) => {
  res.send("API is Running...");
});

//error middleware
app.use(errorHandler);

//server
app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
