const express = require('express');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const timing = require('./middleware/timing');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = 3000;

// Built-in Express middleware for parsing JSON
app.use(express.json());

// Application-level middleware - applies to all routes
app.use(timing); // Timing middleware for all requests
app.use(logger); // Logging middleware for all requests

// Public route - no authentication required
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Express Middleware Demo',
    endpoints: {
      public: '/public',
      protected: '/protected (requires Authorization header)',
      admin: '/admin (requires Authorization header)'
    }
  });
});

// Public route - accessible without authentication
app.get('/public', (req, res) => {
  res.json({
    message: 'This is a public route',
    logInfo: req.logInfo,
    timing: req.timing
  });
});

// Protected route - requires authentication
// Middleware chain: timing -> logger -> auth -> route handler
app.get('/protected', auth, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user,
    logInfo: req.logInfo,
    timing: req.timing
  });
});

// Admin route - requires authentication
// Middleware chain: timing -> logger -> auth -> route handler
app.get('/admin', auth, (req, res) => {
  res.json({
    message: 'This is an admin route',
    user: req.user,
    logInfo: req.logInfo,
    timing: req.timing,
    adminData: {
      totalUsers: 1000,
      activeSessions: 50
    }
  });
});

// Route that intentionally throws an error to test error handling
app.get('/error', (req, res, next) => {
  const error = new Error('This is a test error');
  error.status = 400;
  next(error); // Pass error to error handling middleware
});

// Route that throws an unhandled error
app.get('/crash', (req, res) => {
  throw new Error('Unhandled error - will be caught by error handler');
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.url}`);
  error.status = 404;
  next(error);
});

// Error handling middleware - MUST be last
// This catches all errors passed via next(error)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('\nTest the endpoints:');
  console.log('  GET  http://localhost:3000/');
  console.log('  GET  http://localhost:3000/public');
  console.log('  GET  http://localhost:3000/protected (requires: Authorization: Bearer valid-token-123)');
  console.log('  GET  http://localhost:3000/admin (requires: Authorization: Bearer valid-token-123)');
  console.log('  GET  http://localhost:3000/error (test error handling)');
  console.log('  GET  http://localhost:3000/crash (test unhandled error)');
  console.log('  GET  http://localhost:3000/unknown (test 404)');
});

module.exports = app;

