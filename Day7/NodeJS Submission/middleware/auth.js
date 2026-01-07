/**
 * Authentication Middleware
 * Simulates authentication by checking for an Authorization header
 * In a real application, this would verify JWT tokens, session cookies, etc.
 */
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists
  if (!authHeader) {
    const error = new Error('Authentication required');
    error.status = 401;
    return next(error); // Pass error to error handling middleware
  }

  // Simple token validation (in production, verify JWT or session)
  const token = authHeader.split(' ')[1]; // Format: "Bearer <token>"
  
  if (!token || token !== 'valid-token-123') {
    const error = new Error('Invalid authentication token');
    error.status = 401;
    return next(error);
  }

  // Attach user info to request object
  req.user = {
    id: 1,
    username: 'john_doe',
    email: 'john@example.com'
  };

  console.log(`[AUTH] User authenticated: ${req.user.username}`);
  next();
};

module.exports = auth;

