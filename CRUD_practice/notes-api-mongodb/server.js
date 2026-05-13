const errorHandler = require("./middleware/errorMiddleware");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config(); //laod env

const app = express();

app.use(express.json());

//connect database
connectDB();

//routse importt
const noteRoutes = require("./routes/noteRouters");
const userRoutes = require("./routes/userRoutes");

//router middleware
app.use("/notes", noteRoutes);
app.use("/api/users/", userRoutes);

app.get("/", (req, res) => {
  res.send("API is Running...");
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
