/**
 * Rate Limiter Middleware
 * Limits API requests per IP address to prevent abuse
 * Stores request counts in memory with automatic cleanup
 */

// In-memory store for request counts
// Structure: { ip: { count: number, resetTime: timestamp } }
const requestStore = new Map();

// Configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute in milliseconds
  maxRequests: 10, // Maximum requests per window
  message: 'Too many requests from this IP, please try again later.',
  statusCode: 429, // Too Many Requests
  headers: true, // Add rate limit info to response headers
  skipSuccessfulRequests: false, // Count all requests
  skipFailedRequests: false, // Count failed requests too
};

/**
 * Create rate limiter middleware with custom configuration
 * @param {Object} options - Configuration options
 * @returns {Function} Express middleware function
 */
const createRateLimiter = (options = {}) => {
  const config = { ...RATE_LIMIT_CONFIG, ...options };

  return (req, res, next) => {
    // Get client IP address
    const ip = getClientIp(req);

    // Get or create rate limit data for this IP
    const now = Date.now();
    let limitData = requestStore.get(ip);

    // If no data exists or the window has expired, create new entry
    if (!limitData || now > limitData.resetTime) {
      limitData = {
        count: 0,
        resetTime: now + config.windowMs,
        firstRequestTime: now,
      };
      requestStore.set(ip, limitData);
    }

    // Increment request count
    limitData.count++;

    // Calculate remaining requests and time until reset
    const remaining = Math.max(0, config.maxRequests - limitData.count);
    const resetTime = limitData.resetTime;
    const retryAfter = Math.ceil((resetTime - now) / 1000); // seconds

    // Add rate limit headers if enabled
    if (config.headers) {
      res.setHeader('X-RateLimit-Limit', config.maxRequests);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', new Date(resetTime).toISOString());
    }

    // Check if limit exceeded
    if (limitData.count > config.maxRequests) {
      res.setHeader('Retry-After', retryAfter);

      return res.status(config.statusCode).json({
        error: 'Rate limit exceeded',
        message: config.message,
        details: {
          limit: config.maxRequests,
          windowMs: config.windowMs,
          retryAfter: `${retryAfter} seconds`,
          resetTime: new Date(resetTime).toISOString(),
        },
      });
    }

    // Request is within limit, proceed
    next();
  };
};

/**
 * Get client IP address from request
 * Handles proxies and load balancers
 * @param {Object} req - Express request object
 * @returns {String} Client IP address
 */
const getClientIp = (req) => {
  // Check various headers for the real IP (in case of proxies)
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip ||
    'unknown'
  );
};

/**
 * Reset rate limit for a specific IP
 * @param {String} ip - IP address to reset
 * @returns {Boolean} Success status
 */
const resetIpLimit = (ip) => {
  if (requestStore.has(ip)) {
    requestStore.delete(ip);
    return true;
  }
  return false;
};

/**
 * Reset all rate limits
 * Clears the entire request store
 */
const resetAllLimits = () => {
  requestStore.clear();
  console.log('All rate limits have been reset');
};

/**
 * Get current rate limit status for an IP
 * @param {String} ip - IP address to check
 * @returns {Object|null} Rate limit status or null
 */
const getRateLimitStatus = (ip) => {
  const limitData = requestStore.get(ip);
  if (!limitData) return null;

  const now = Date.now();
  const remaining = Math.max(0, RATE_LIMIT_CONFIG.maxRequests - limitData.count);
  const resetTime = limitData.resetTime;

  return {
    ip,
    count: limitData.count,
    limit: RATE_LIMIT_CONFIG.maxRequests,
    remaining,
    resetTime: new Date(resetTime).toISOString(),
    resetIn: Math.ceil((resetTime - now) / 1000),
    isBlocked: limitData.count > RATE_LIMIT_CONFIG.maxRequests,
  };
};

/**
 * Get all active rate limits
 * Useful for monitoring and debugging
 * @returns {Array} Array of rate limit statuses
 */
const getAllRateLimitStatuses = () => {
  const now = Date.now();
  const statuses = [];

  for (const [ip, data] of requestStore.entries()) {
    // Skip expired entries
    if (now > data.resetTime) {
      requestStore.delete(ip);
      continue;
    }

    statuses.push({
      ip,
      count: data.count,
      limit: RATE_LIMIT_CONFIG.maxRequests,
      remaining: Math.max(0, RATE_LIMIT_CONFIG.maxRequests - data.count),
      resetTime: new Date(data.resetTime).toISOString(),
      resetIn: Math.ceil((data.resetTime - now) / 1000),
      isBlocked: data.count > RATE_LIMIT_CONFIG.maxRequests,
    });
  }

  return statuses;
};

/**
 * Cleanup expired entries from the store
 * Should be called periodically to prevent memory leaks
 */
const cleanupExpiredEntries = () => {
  const now = Date.now();
  let cleanedCount = 0;

  for (const [ip, data] of requestStore.entries()) {
    if (now > data.resetTime) {
      requestStore.delete(ip);
      cleanedCount++;
    }
  }

  if (cleanedCount > 0) {
    console.log(`Cleaned up ${cleanedCount} expired rate limit entries`);
  }

  return cleanedCount;
};

// Automatic cleanup every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const cleanupInterval = setInterval(cleanupExpiredEntries, CLEANUP_INTERVAL);

// Graceful shutdown: clear interval
process.on('SIGINT', () => {
  clearInterval(cleanupInterval);
  console.log('Rate limiter cleanup interval stopped');
});

process.on('SIGTERM', () => {
  clearInterval(cleanupInterval);
  console.log('Rate limiter cleanup interval stopped');
});

/**
 * Default rate limiter with standard configuration
 */
const rateLimiter = createRateLimiter();

/**
 * Strict rate limiter for sensitive endpoints (e.g., login, signup)
 */
const strictRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // Only 5 requests per minute
  message: 'Too many attempts from this IP, please try again later.',
});

/**
 * Lenient rate limiter for public endpoints
 */
const lenientRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 requests per minute
  message: 'Rate limit exceeded for this endpoint.',
});

module.exports = {
  rateLimiter,
  strictRateLimiter,
  lenientRateLimiter,
  createRateLimiter,
  resetIpLimit,
  resetAllLimits,
  getRateLimitStatus,
  getAllRateLimitStatuses,
  cleanupExpiredEntries,
  getClientIp,
};

