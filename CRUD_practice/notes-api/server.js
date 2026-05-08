const express = require("express");
const app = express();

const noteRoutes = require("./routes/noteRoutes");

app.use(express.json());

app.use("/notes", noteRoutes);

//global error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
