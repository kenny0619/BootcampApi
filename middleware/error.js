const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  //make a copy from the err object
  let error = { ...err };

  // set message of err to error
  error.message = err.message;

  // Log to console for dev
  console.log(err.stack.red);

  // mongoose bad objectid
  if (err.name === "CastError") {
    const message = `Resource with id of ${err.value} not found`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose Duplicate Error
  if (err.code === 11000) {
    const message = "Duplicate Fiels entered";
    error = new ErrorResponse(message, 400);
  }

  // mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  // client response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

// export error handler middleware
module.exports = errorHandler;
