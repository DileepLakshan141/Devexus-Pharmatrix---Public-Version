const NotFound = (req, res, next) => {
  const error = new Error(`The requested url is not found -${req.originalUrl}`);
  res.status(404);
  next(error);
};

const ErrorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    type: err.name,
    stack:
      process.env.NODE_ENV === "production" ? "Production Failed" : err.stack,
  });
};

module.exports = { NotFound, ErrorHandler };
