# Express Authentication API

A complete Express.js authentication system with JWT tokens, cookie-based sessions, and protected routes.

## Features

- ✅ User registration (signup)
- ✅ User login with JWT tokens
- ✅ Cookie-based authentication
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware
- ✅ Role-based access control (User/Admin)
- ✅ Profile management
- ✅ Logout functionality

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/auth-demo
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Server

```bash
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### Public Routes (No Authentication Required)

#### 1. Test Route
```
GET /test
```
Test if server is running.

**Response:**
```json
{
  "message": "This is test route"
}
```

#### 2. User Signup
```
POST /users/signup
```

**Request Body:**
```json
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
      "role": "user"
    },
    "token": "jwt-token-here"
  }
}
```

**Note:** Sets `authToken` cookie automatically.

#### 3. User Login
```
POST /users/login
```

**Request Body:**
```json
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
    "token": "jwt-token-here"
  }
}
```

**Note:** Sets `authToken` cookie automatically.

### Protected Routes (Authentication Required)

**Note:** All protected routes require the `authToken` cookie to be set.

#### 4. Get User Profile
```
GET /users/profile
```

**Headers:**
- Cookie must contain `authToken`

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
    }
  }
}
```

#### 5. Update Profile
```
PUT /users/profile
```

**Request Body:**
```json
{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "...",
      "username": "newusername",
      "email": "newemail@example.com",
      "role": "user"
    }
  }
}
```

#### 6. Logout
```
POST /users/logout
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Note:** Clears the `authToken` cookie.

### Admin Only Routes

**Note:** Requires authentication AND admin role.

#### 7. Get All Users
```
GET /users/all
```

**Response (200):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "count": 5,
    "users": [
      {
        "id": "...",
        "username": "user1",
        "email": "user1@example.com",
        "role": "user",
        "createdAt": "...",
        "updatedAt": "..."
      }
      // ... more users
    ]
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide email and password"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access denied. No token provided. Please login first."
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "message": "This route is not defined"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Error during login",
  "error": "Error message here"
}
```

## Testing with Postman/Thunder Client

1. **Signup**: POST to `/users/signup`
2. **Login**: POST to `/users/login` (automatically sets cookie)
3. **Access Protected Routes**: GET `/users/profile` (cookie is sent automatically)
4. **Create Admin**: POST to `/users/signup` with `"role": "admin"`
5. **Test Admin Route**: GET `/users/all` (must be logged in as admin)

## Middleware

### authMiddleware
- Verifies JWT token from cookies
- Attaches user object to `req.user`
- Returns 401 if no token or invalid token

### adminMiddleware
- Checks if `req.user.role === 'admin'`
- Returns 403 if not admin
- Must be used after `authMiddleware`

## Security Features

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ HttpOnly cookies (prevents XSS attacks)
- ✅ JWT expiration (7 days default)
- ✅ Input validation
- ✅ Secure cookie settings in production
- ✅ SameSite cookie attribute

## Project Structure

```
Day2/NodeJS Submission/
├── configs/
│   └── mongo.db.js          # MongoDB connection
├── controllers/
│   └── user.controller.js   # User controllers
├── middleware/
│   └── auth.middleware.js   # Authentication middleware
├── models/
│   └── user.models.js       # User model
├── routes/
│   └── users.router.js      # User routes
├── server.js                # Main server file
├── package.json
└── .env                     # Environment variables
```

## Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT token generation
- cookie-parser - Cookie parsing
- dotenv - Environment variables

## Created By

This authentication system implements:
- Basic Authentication with JWT
- Cookie-based sessions
- Protected routes with middleware
- Role-based access control
- Complete CRUD for user management

