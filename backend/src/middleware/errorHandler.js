/**
 * 404 Not Found Middleware
 */
function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Endpoint '${req.originalUrl}' not found on Jubilee Claims API.`
  });
}

/**
 * Global Error Handler Middleware
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled API Error:', err);

  // PostgreSQL Unique Constraint Error
  if (err.code === '23505') {
    return res.status(400).json({
      success: false,
      error: 'A record with this unique identifier already exists.'
    });
  }

  // PostgreSQL Invalid UUID Error
  if (err.code === '22P02') {
    return res.status(400).json({
      success: false,
      error: 'Invalid UUID format provided for claim ID.'
    });
  }

  // Custom Application Error
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  }

  return res.status(500).json({
    success: false,
    error: 'An internal server error occurred.'
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
