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
