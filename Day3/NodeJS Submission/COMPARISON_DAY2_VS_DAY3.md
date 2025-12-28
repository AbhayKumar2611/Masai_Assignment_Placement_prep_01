# Day 2 vs Day 3: Authentication Comparison

## Overview

| Aspect             | Day 2 (Cookie-Based Auth)       | Day 3 (JWT Header-Based Auth)             |
| ------------------ | ------------------------------- | ----------------------------------------- |
| Token Storage      | Server sets HttpOnly cookie     | Client stores token (localStorage/memory) |
| Token Transmission | Automatic via browser cookies   | Manual via Authorization header           |
| Header Format      | N/A (cookie sent automatically) | `Authorization: Bearer <token>`           |
| Best For           | Traditional web apps            | APIs, mobile apps, SPAs                   |
| CORS               | Can be complex                  | Simpler                                   |
| Mobile Support     | Limited                         | Excellent                                 |
| Token Access       | Client cannot access (httpOnly) | Client can read token                     |

## Request Examples

### Day 2: Cookie-Based

**Login Response:**

```http
HTTP/1.1 200 OK
Set-Cookie: authToken=eyJhbG...; HttpOnly; Path=/; SameSite=strict

{
  "success": true,
  "token": "eyJhbG..."
}
```

**Accessing Protected Route:**

```http
GET /users/profile HTTP/1.1
Cookie: authToken=eyJhbG...
```

↪ Cookie sent automatically by browser

---

### Day 3: JWT Header-Based

**Login Response:**

```http
HTTP/1.1 200 OK

{
  "success": true,
  "data": {
    "token": "eyJhbG...",
    "tokenType": "Bearer",
    "expiresIn": "24h"
  }
}
```

**Accessing Protected Route:**

```http
GET /users/profile HTTP/1.1
Authorization: Bearer eyJhbG...
```

↪ Client must include header manually

## Code Comparison

### Login Function

**Day 2 (Cookie-Based):**

```javascript
const login = async (req, res) => {
  // ... validate credentials ...

  const token = generateToken(user._id);

  // Set cookie
  res.cookie("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  });

  res.json({ token });
};
```

**Day 3 (JWT Header-Based):**

```javascript
const login = async (req, res) => {
  // ... validate credentials ...

  const token = generateToken(user._id);

  // Return token in response (no cookie)
  res.json({
    token: token,
    tokenType: "Bearer",
    expiresIn: "24h",
  });
};
```

### Authentication Middleware

**Day 2 (Cookie-Based):**

```javascript
const authMiddleware = async (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({
      message: "No token in cookies",
    });
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = await User.findById(decoded.userId);
  next();
};
```

**Day 3 (JWT Header-Based):**

```javascript
const jwtAuthMiddleware = async (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token in Authorization header",
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  req.user = await User.findById(decoded.userId);
  next();
};
```

### Client-Side Usage

**Day 2 (Cookie-Based) - JavaScript:**

```javascript
// Login
fetch("http://localhost:3000/users/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
  credentials: "include", // Important for cookies!
});

// Access protected route
fetch("http://localhost:3000/users/profile", {
  credentials: "include", // Cookie sent automatically
});
```

**Day 3 (JWT Header-Based) - JavaScript:**

```javascript
// Login
const response = await fetch("http://localhost:3000/users/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const { token } = await response.json();
localStorage.setItem("token", token); // Store token

// Access protected route
fetch("http://localhost:3000/users/profile", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
```

## Middleware Setup

### Day 2 (Cookie-Based)

**server.js:**

```javascript
const cookieParser = require("cookie-parser");
app.use(cookieParser()); // Required for cookies
```

### Day 3 (JWT Header-Based)

**server.js:**

```javascript
app.use(express.json()); // Only need JSON parsing
// No cookie-parser needed
```

## Logout Implementation

### Day 2 (Cookie-Based)

```javascript
const logout = async (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logged out" });
};
```

↪ Server clears the cookie

### Day 3 (JWT Header-Based)

```javascript
// No server-side logout needed
// Client just deletes the token
localStorage.removeItem("token");
```

↪ Client removes token from storage

## Security Considerations

### Day 2 (Cookie-Based)

**Pros:**

- ✅ HttpOnly cookies prevent XSS attacks
- ✅ SameSite attribute prevents CSRF
- ✅ Token not accessible via JavaScript

**Cons:**

- ❌ CSRF attacks possible without proper protection
- ❌ Requires cookie-parser middleware
- ❌ CORS can be complex

### Day 3 (JWT Header-Based)

**Pros:**

- ✅ No CSRF vulnerability
- ✅ Works seamlessly with mobile apps
- ✅ Simpler CORS setup
- ✅ Token can be read by client (for metadata)

**Cons:**

- ❌ Vulnerable to XSS if stored in localStorage
- ❌ Client must manually include header
- ❌ Token visible to JavaScript

## Mobile App Usage

### Day 2 (Cookie-Based)

```
❌ Limited Support
- Cookies work differently on mobile
- Native apps don't handle cookies well
- Requires additional configuration
```

### Day 3 (JWT Header-Based)

```
✅ Excellent Support
- Works perfectly with React Native
- Works with Flutter
- Works with any HTTP client
- Just include Authorization header
```

## Testing with curl

### Day 2 (Cookie-Based)

```bash
# Login (save cookie)
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Use protected route (send cookie)
curl http://localhost:3000/users/profile \
  -b cookies.txt
```

### Day 3 (JWT Header-Based)

```bash
# Login (get token)
TOKEN=$(curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.token')

# Use protected route (send token)
curl http://localhost:3000/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

## When to Use Which?

### Use Cookie-Based (Day 2) When:

- ✅ Building traditional server-rendered web app
- ✅ Need maximum XSS protection
- ✅ Users only on web browsers
- ✅ Want automatic token handling
- ✅ Server and client on same domain

### Use JWT Header-Based (Day 3) When:

- ✅ Building REST API for mobile apps
- ✅ Building SPA (React, Vue, Angular)
- ✅ Need stateless authentication
- ✅ Multiple clients (web, mobile, desktop)
- ✅ Microservices architecture
- ✅ Cross-domain requests common

## Summary Table

| Feature          | Day 2 (Cookies)  | Day 3 (JWT Headers) |
| ---------------- | ---------------- | ------------------- |
| Setup Complexity | Medium           | Low                 |
| Mobile Support   | ❌ Limited       | ✅ Excellent        |
| XSS Protection   | ✅ High          | ⚠️ Medium           |
| CSRF Protection  | ⚠️ Need SameSite | ✅ Immune           |
| Token Management | Automatic        | Manual              |
| CORS Complexity  | High             | Low                 |
| Stateless        | ✅ Yes           | ✅ Yes              |
| Token Refresh    | Easy             | Easy                |
| Best For         | Web Apps         | APIs/Mobile         |

## Migration Path

If you need to switch from one to the other:

### Cookie → JWT Header

1. Remove cookie-parser
2. Change login to return token in body
3. Update middleware to read Authorization header
4. Update client to store and send token

### JWT Header → Cookie

1. Add cookie-parser
2. Change login to set cookie
3. Update middleware to read from req.cookies
4. Update client to use credentials: 'include'

---

## Conclusion

Both approaches are valid JWT authentication methods:

- **Day 2 (Cookie-Based)**: Best for traditional web applications where security against XSS is paramount
- **Day 3 (JWT Header-Based)**: Best for modern APIs, SPAs, and mobile applications where flexibility is key

Choose based on your specific use case! 🎯
