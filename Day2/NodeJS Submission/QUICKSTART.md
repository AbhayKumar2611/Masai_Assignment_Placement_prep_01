# Quick Start Guide

## Prerequisites

- Node.js installed
- MongoDB running locally or connection string ready

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Environment File

Create a `.env` file in the root directory with:

```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/auth-demo
JWT_SECRET=my-super-secret-jwt-key-2024
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start the Server

```bash
npm start
```

You should see:

```
MongoDB Connected Successfully
Your server is running on http://localhost:3000
```

## Test the Implementation

### Step 1: Test Server is Running

```bash
curl http://localhost:3000/test
```

Expected: `{"message":"This is test route"}`

### Step 2: Create a User

**Using curl:**

```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

**Using Postman/Thunder Client:**

- Method: POST
- URL: http://localhost:3000/users/signup
- Body (JSON):

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

Expected Response (201):

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "username": "testuser",
      "email": "test@example.com",
      "role": "user"
    },
    "token": "..."
  }
}
```

### Step 3: Login

**Using curl:**

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

**Using Postman/Thunder Client:**

- Method: POST
- URL: http://localhost:3000/users/login
- Body (JSON):

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

✅ **Cookie `authToken` is automatically set!**

### Step 4: Access Protected Route

**Using curl:**

```bash
curl http://localhost:3000/users/profile -b cookies.txt
```

**Using Postman/Thunder Client:**

- Method: GET
- URL: http://localhost:3000/users/profile
- Cookies are sent automatically

Expected Response (200):

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
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

### Step 5: Try Without Login

1. Clear cookies or open new request
2. Try to access: GET http://localhost:3000/users/profile

Expected Response (401):

```json
{
  "success": false,
  "message": "Access denied. No token provided. Please login first."
}
```

✅ **Middleware is working!**

### Step 6: Create Admin User

```json
POST http://localhost:3000/users/signup

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

### Step 7: Test Admin Route

1. Login as admin
2. Access: GET http://localhost:3000/users/all

Expected: List of all users (only works for admin)

### Step 8: Test Admin Restriction

1. Login as regular user (from Step 2)
2. Try: GET http://localhost:3000/users/all

Expected Response (403):

```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

✅ **Role-based authorization working!**

### Step 9: Logout

```bash
POST http://localhost:3000/users/logout
```

Expected Response (200):

```json
{
  "success": true,
  "message": "Logout successful"
}
```

Cookie is cleared, and you can no longer access protected routes.

## Troubleshooting

### MongoDB Connection Error

- Make sure MongoDB is running
- Check MONGO_URL in .env file
- Try: `mongod` to start MongoDB

### Port Already in Use

- Change PORT in .env file
- Or stop the process using port 3000

### Cookie Not Working

- Make sure cookie-parser is installed
- Check browser/client supports cookies
- In Postman, cookies are handled automatically

### Token Expired

- Login again to get a new token
- Token expires after 7 days by default

## Next Steps

1. ✅ Authentication system is complete
2. Add more user fields as needed
3. Implement password reset functionality
4. Add email verification
5. Add refresh token mechanism
6. Implement rate limiting
7. Add request validation library (e.g., Joi)

## Files Created

✅ `models/user.models.js` - User schema  
✅ `middleware/auth.middleware.js` - Auth middleware  
✅ `controllers/user.controller.js` - User controllers  
✅ `routes/users.router.js` - User routes  
✅ `server.js` - Updated server  
✅ `README.md` - Full documentation  
✅ `API_TESTING_GUIDE.js` - Testing examples  
✅ `IMPLEMENTATION_SUMMARY.md` - Implementation details  
✅ `QUICKSTART.md` - This file

---

**Happy Coding! 🚀**
