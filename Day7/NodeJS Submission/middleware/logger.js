/**
 * Logging Middleware
 * Logs request details including method, URL, IP, timestamp, and user agent
 */
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl || req.url;
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent') || 'Unknown';

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`);

  // Attach log info to request object for use in other middleware
  req.logInfo = {
    timestamp,
    method,
    url,
    ip,
    userAgent
  };

  next();
};

module.exports = logger;

