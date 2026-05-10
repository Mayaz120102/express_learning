const errorHandler = (err, req, res, next) => {
  // console.log("error object", err);
  console.log("Error: ", err.message);

  //if no status set, default = 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res
    .status(statusCode)
    .json({ message: err.message || "Something went Wrong" });
};

module.exports = errorHandler;
