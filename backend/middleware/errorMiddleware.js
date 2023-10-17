const notFound = (req, res, next) => {
  const error = new Error(`Not Found ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode !== 200 ? 500 : res.statusCode; // Corrected conditional statement
  res.status(statusCode);
  res.json({
    message: error.message, // Corrected variable name to 'error'
    stack: process.env.NODE_ENV === "production" ? null : error.stack, // Corrected variable name to 'error'
  });
};

module.exports = { notFound, errorHandler };
