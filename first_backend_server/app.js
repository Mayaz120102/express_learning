// step 1 : importing http module
const http = require("http");

// creating server
// const server = http.createServer((req, res) => {
//   res.end("hello from my flagman pc 🚀");
// });

//solutin for url
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    res.end("Home page");
  } else if (req.url == "/about") {
    res.end("About Page");
  } else {
    res.end("404 not found");
  }
});

// start server

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
