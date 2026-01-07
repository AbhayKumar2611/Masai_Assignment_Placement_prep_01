/**
 * Request Timing Middleware
 * Measures the time taken to process a request
 */
const timing = (req, res, next) => {
  const startTime = Date.now();

  // Override res.end to capture response time
  const originalEnd = res.end;
  
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    
    // Add timing header to response
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    // Log timing information
    console.log(`[TIMING] ${req.method} ${req.url} - ${duration}ms`);
    
    // Attach timing to request object
    req.timing = {
      startTime,
      duration,
      endTime: Date.now()
    };

    // Call original end method
    originalEnd.apply(this, args);
  };

  next();
};

module.exports = timing;

