const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

/**
 * Authentication Middleware verifying JWT token
 */
function authenticateOfficer(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in as a Claims Officer.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.officer = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired authentication session. Please log in again.'
    });
  }
}

module.exports = {
  authenticateOfficer
};
