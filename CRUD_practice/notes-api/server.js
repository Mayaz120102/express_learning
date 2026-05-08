const express = require("express");
const app = express();

app.use(express.json());

const noteRoutes = require("./routes/noteRoutes");

app.use("/notes", noteRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
