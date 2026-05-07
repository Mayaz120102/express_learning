const express = require("express");

const app = express();

//middle ware
// app.use((req, res, next) => {
//   console.log("middle ware running...");
//   next();
// });

app.use(express.json());

const userRoutes = require("./routes/userRoutes");

// //home route
// app.get("/", (req, res) => {
//   res.send("Home page");
// });

// // about route
// app.get("/about", (req, res) => {
//   res.send("About page");
// });

// app.get("/user", (req, res) => {
//   res.send({ name: "Abrar", age: 22 });
// });

// //route param,
// app.get("/user/:id", (req, res) => {
//   res.send(req.params.id);
// });
// // start server

// //query params
// app.get("/search", (req, res) => {
//   res.send(req.query);
// });

// //post
// app.post("/user", (req, res) => {
//   console.log(req.body);
//   res.send(req.body);
//   //   res.send("user created");
// });

app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("server running on port 3000");
});
