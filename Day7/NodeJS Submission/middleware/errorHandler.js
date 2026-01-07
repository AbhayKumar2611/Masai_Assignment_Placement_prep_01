/**
 * Error Handling Middleware
 * Handles errors and sends appropriate responses
 * Must be defined after all routes and middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log error details
  console.error(`[ERROR] ${err.message}`);
  console.error(`[ERROR] Stack: ${err.stack}`);

  // Get status code from error or default to 500
  const statusCode = err.status || err.statusCode || 500;

  // Prepare error response
  const errorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl || req.url
    }
  };

  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    errorResponse.error.stack = err.stack;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

module.exports = errorHandler;

