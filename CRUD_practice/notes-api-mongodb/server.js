const errorHandler = require("./middleware/errorMiddleware");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config(); //laod env

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

//body parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

//connect database
connectDB();

//routse importt
const noteRoutes = require("./routes/noteRouters");
const userRoutes = require("./routes/userRoutes");

//router middleware
app.use("/api/notes", noteRoutes);
app.use("/api/users/", userRoutes);

app.get("/", (req, res) => {
  res.send("API is Running...");
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
