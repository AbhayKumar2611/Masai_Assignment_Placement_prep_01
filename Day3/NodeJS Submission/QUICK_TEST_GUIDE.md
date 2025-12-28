# JWT Authentication - Quick Test Guide

## Prerequisites

- Server running on http://localhost:3000
- MongoDB connected

## Testing Workflow

### 1. Test Server

```bash
curl http://localhost:3000/test
```

Expected: `{"message":"This is test route"}`

---

### 2. Register a User (Signup)

```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "24h",
    "expiresAt": "..."
  }
}
```

**📋 Copy the token value!**

---

### 3. Login

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected: Same format as signup with new token**

---

### 4. Access Protected Route (Get Profile)

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with the actual token from signup/login.

**Expected Response:**

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "...",
      "username": "testuser",
      "email": "test@example.com",
      "role": "user",
      ...
    },
    "tokenInfo": {
      "issuedAt": "...",
      "expiresAt": "...",
      "timeRemaining": "86400 seconds"
    }
  }
}
```

---

### 5. Extract User Info from JWT

```bash
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

This demonstrates **extracting user info directly from the JWT token**.

**Expected Response:**

```json
{
  "success": true,
  "message": "User info extracted from JWT token",
  "data": {
    "extractedFrom": "JWT Authorization Header",
    "userId": "...",
    "user": { ... },
    "tokenMetadata": {
      "issuedAt": "...",
      "expiresAt": "...",
      "isValid": true,
      "secondsUntilExpiry": 86400
    }
  }
}
```

---

### 6. Verify Token Validity

```bash
curl -X GET http://localhost:3000/users/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "valid": true,
    "tokenInfo": {
      "secondsRemaining": 86400,
      "isExpiringSoon": false,
      "recommendation": "Token is valid"
    }
  }
}
```

---

### 7. Test Without Token (Should Fail)

```bash
curl -X GET http://localhost:3000/users/profile
```

**Expected Response (401):**

```json
{
  "success": false,
  "message": "Access denied. No token provided. Please login first.",
  "hint": "Include token in Authorization header as: Bearer <token>"
}
```

✅ **Middleware is working!**

---

### 8. Test with Invalid Token (Should Fail)

```bash
curl -X GET http://localhost:3000/users/profile \
  -H "Authorization: Bearer invalid.token.here"
```

**Expected Response (401):**

```json
{
  "success": false,
  "message": "Invalid token. Please login again.",
  "error": "jwt malformed"
}
```

✅ **Token verification working!**

---

### 9. Refresh Token

```bash
curl -X POST http://localhost:3000/users/refresh \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "NEW_TOKEN_HERE",
    "tokenType": "Bearer",
    "expiresIn": "24h",
    "expiresAt": "...",
    "oldTokenExpiry": "..."
  }
}
```

Use the new token for subsequent requests.

---

### 10. Update Profile

```bash
curl -X PUT http://localhost:3000/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "updateduser",
    "email": "updated@example.com"
  }'
```

---

### 11. Create Admin User

```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

**📋 Copy the admin token!**

---

### 12. Access Admin Route

```bash
curl -X GET http://localhost:3000/users/all \
  -H "Authorization: Bearer ADMIN_TOKEN_HERE"
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "count": 2,
    "users": [...]
  }
}
```

---

### 13. Test Admin Route as Regular User (Should Fail)

```bash
curl -X GET http://localhost:3000/users/all \
  -H "Authorization: Bearer REGULAR_USER_TOKEN"
```

**Expected Response (403):**

```json
{
  "success": false,
  "message": "Access denied. Admin privileges required.",
  "currentRole": "user"
}
```

✅ **Role-based authorization working!**

---

### 14. Test Token Expiration

**Option A: Wait for token to expire (24 hours by default)**

**Option B: Set short expiration for testing**

1. Update `.env`: `JWT_EXPIRE=10s`
2. Restart server
3. Signup/Login to get token
4. Wait 10+ seconds
5. Try to access protected route

**Expected Response (401):**

```json
{
  "success": false,
  "message": "Token has expired. Please login again.",
  "expiredAt": "2024-01-01T00:00:10.000Z"
}
```

✅ **Token expiration handling working!**

---

## Testing with Postman

### Setup

1. Create new request
2. Set method and URL
3. Go to "Authorization" tab
4. Select "Bearer Token"
5. Paste your JWT token

### OR

1. Go to "Headers" tab
2. Add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

---

## Environment Variables for Testing

### Normal Testing (24-hour expiration)

```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/jwt-auth-demo
JWT_SECRET=test-secret-key
JWT_EXPIRE=24h
NODE_ENV=development
```

### Quick Expiration Testing

```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/jwt-auth-demo
JWT_SECRET=test-secret-key
JWT_EXPIRE=10s
NODE_ENV=development
```

---

## Common Issues

### 1. "Cannot find path" error

- Make sure you're in the correct directory
- Run: `cd "Day3/NodeJS Submission"`

### 2. "MongoDB connection error"

- Start MongoDB: `mongod` or `brew services start mongodb-community`
- Check MONGO_URL in .env

### 3. "JWT_SECRET is not defined"

- Create .env file with JWT_SECRET

### 4. Token not working

- Check Authorization header format: `Bearer <token>`
- Make sure there's a space after "Bearer"
- Token should not have quotes around it

---

## Success Checklist

✅ Server starts without errors  
✅ Can signup and get JWT token  
✅ Can login and get JWT token  
✅ Can access protected routes with valid token  
✅ Cannot access protected routes without token (401)  
✅ Cannot access protected routes with invalid token (401)  
✅ Cannot access protected routes with expired token (401)  
✅ Can extract user info from JWT token  
✅ Can verify token validity  
✅ Can refresh token  
✅ Regular user cannot access admin routes (403)  
✅ Admin can access admin routes

---

**All JWT Authentication Features Working!** 🎉
