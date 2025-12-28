# Authentication Flow Diagram

## 1. Registration (Signup) Flow

```
┌─────────────┐
│   Client    │
│  (Browser)  │
└──────┬──────┘
       │ POST /users/signup
       │ { username, email, password }
       ▼
┌─────────────────────────────────────────┐
│          Express Server                 │
│  ┌──────────────────────────────────┐   │
│  │   User Controller - signup()      │   │
│  │   1. Validate input               │   │
│  │   2. Check if user exists         │   │
│  │   3. Hash password (bcrypt)       │   │
│  │   4. Save user to MongoDB         │   │
│  │   5. Generate JWT token           │   │
│  │   6. Set httpOnly cookie          │   │
│  │   7. Return user data + token     │   │
│  └──────────────────────────────────┘   │
└──────────┬──────────────────────────────┘
           │
           ▼
    ┌─────────────┐
    │   MongoDB   │
    │   Database  │
    └─────────────┘
```

## 2. Login Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /users/login
       │ { email, password }
       ▼
┌─────────────────────────────────────────┐
│          Express Server                 │
│  ┌──────────────────────────────────┐   │
│  │   User Controller - login()       │   │
│  │   1. Find user by email           │   │
│  │   2. Compare password with hash   │   │
│  │   3. Generate JWT token           │   │
│  │   4. Set httpOnly cookie          │   │
│  │   5. Return user data + token     │   │
│  └──────────────────────────────────┘   │
└──────────┬──────────────────────────────┘
           │
           ▼
    ┌─────────────┐
    │   MongoDB   │
    └─────────────┘
```

## 3. Protected Route Access Flow

```
┌─────────────┐
│   Client    │
│ (with cookie)│
└──────┬──────┘
       │ GET /users/profile
       │ Cookie: authToken=jwt...
       ▼
┌─────────────────────────────────────────────┐
│          Express Server                     │
│  ┌────────────────────────────────────┐     │
│  │   Auth Middleware                  │     │
│  │   1. Extract token from cookies    │     │
│  │   2. Verify JWT signature          │     │
│  │   3. Decode userId from token      │     │
│  │   4. Fetch user from database      │     │
│  │   5. Attach user to req.user       │     │
│  │   6. Call next()                   │     │
│  └──────────┬─────────────────────────┘     │
│             ▼                                │
│  ┌────────────────────────────────────┐     │
│  │   User Controller - getProfile()   │     │
│  │   1. Access req.user               │     │
│  │   2. Return profile data           │     │
│  └────────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

## 4. Unauthorized Access Attempt

```
┌─────────────┐
│   Client    │
│ (no cookie) │
└──────┬──────┘
       │ GET /users/profile
       │ (No auth cookie)
       ▼
┌─────────────────────────────────────────┐
│          Express Server                 │
│  ┌──────────────────────────────────┐   │
│  │   Auth Middleware                │   │
│  │   1. Extract token from cookies  │   │
│  │   2. No token found!             │   │
│  │   3. Return 401 error            │   │
│  │   ❌ Request blocked             │   │
│  └──────────────────────────────────┘   │
└──────────┬──────────────────────────────┘
           │
           ▼
    ┌─────────────┐
    │   Client    │
    │ 401 Error   │
    └─────────────┘
```

## 5. Admin Route Access Flow

```
┌─────────────┐
│   Client    │
│ (admin user)│
└──────┬──────┘
       │ GET /users/all
       │ Cookie: authToken=jwt...
       ▼
┌─────────────────────────────────────────────┐
│          Express Server                     │
│  ┌────────────────────────────────────┐     │
│  │   Auth Middleware                  │     │
│  │   ✅ Token verified                │     │
│  │   ✅ User attached to req          │     │
│  └──────────┬─────────────────────────┘     │
│             ▼                                │
│  ┌────────────────────────────────────┐     │
│  │   Admin Middleware                 │     │
│  │   1. Check req.user.role           │     │
│  │   2. If role === 'admin': next()   │     │
│  │   3. Else: Return 403 Forbidden    │     │
│  └──────────┬─────────────────────────┘     │
│             ▼                                │
│  ┌────────────────────────────────────┐     │
│  │   User Controller - getAllUsers()  │     │
│  │   1. Fetch all users from DB       │     │
│  │   2. Return users list             │     │
│  └────────────────────────────────────┘     │
└─────────────────────────────────────────────┘
```

## 6. Logout Flow

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /users/logout
       │ Cookie: authToken=jwt...
       ▼
┌─────────────────────────────────────────┐
│          Express Server                 │
│  ┌──────────────────────────────────┐   │
│  │   Auth Middleware                │   │
│  │   ✅ Verify user is logged in    │   │
│  └──────────┬───────────────────────┘   │
│             ▼                            │
│  ┌──────────────────────────────────┐   │
│  │   User Controller - logout()     │   │
│  │   1. Clear authToken cookie      │   │
│  │   2. Return success message      │   │
│  └──────────────────────────────────┘   │
└──────────┬──────────────────────────────┘
           │
           ▼
    ┌─────────────┐
    │   Client    │
    │ Cookie gone │
    └─────────────┘
```

## Component Interaction Diagram

```
┌──────────────────────────────────────────────────────────┐
│                      Client (Browser/Postman)            │
│  - Makes HTTP requests                                   │
│  - Stores cookies automatically                          │
│  - Sends cookies with each request                       │
└────────────────────┬─────────────────────────────────────┘
                     │
                     │ HTTP Request (with/without cookie)
                     ▼
┌──────────────────────────────────────────────────────────┐
│                   Express.js Server                      │
│                                                           │
│  ┌─────────────────────────────────────────────────┐     │
│  │  Middleware Layer                               │     │
│  │  - express.json()                               │     │
│  │  - cookieParser()                               │     │
│  │  - authMiddleware (auth.middleware.js)          │     │
│  │  - adminMiddleware (auth.middleware.js)         │     │
│  └──────────────┬──────────────────────────────────┘     │
│                 ▼                                         │
│  ┌─────────────────────────────────────────────────┐     │
│  │  Routes Layer (users.router.js)                 │     │
│  │  - Maps URLs to controllers                     │     │
│  │  - Applies middleware to routes                 │     │
│  └──────────────┬──────────────────────────────────┘     │
│                 ▼                                         │
│  ┌─────────────────────────────────────────────────┐     │
│  │  Controllers Layer (user.controller.js)         │     │
│  │  - Business logic                               │     │
│  │  - Input validation                             │     │
│  │  - JWT token generation                         │     │
│  │  - Cookie management                            │     │
│  └──────────────┬──────────────────────────────────┘     │
│                 ▼                                         │
│  ┌─────────────────────────────────────────────────┐     │
│  │  Models Layer (user.models.js)                  │     │
│  │  - Database schema                              │     │
│  │  - Password hashing (pre-save hook)             │     │
│  │  - Password comparison method                   │     │
│  └──────────────┬──────────────────────────────────┘     │
└─────────────────┼───────────────────────────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │   MongoDB       │
         │   Database      │
         │   - Users       │
         └─────────────────┘
```

## Security Features Diagram

```
┌─────────────────────────────────────────────────────┐
│               Security Layers                       │
│                                                     │
│  1. Password Security                               │
│     ┌───────────────────────────────────┐          │
│     │ Plain Password → bcrypt.hash()    │          │
│     │ → Hashed Password (stored in DB)  │          │
│     └───────────────────────────────────┘          │
│                                                     │
│  2. Token Security                                  │
│     ┌───────────────────────────────────┐          │
│     │ User ID + Secret → JWT Token      │          │
│     │ Token expires in 7 days           │          │
│     └───────────────────────────────────┘          │
│                                                     │
│  3. Cookie Security                                 │
│     ┌───────────────────────────────────┐          │
│     │ httpOnly: true (no JS access)     │          │
│     │ secure: true (HTTPS only in prod) │          │
│     │ sameSite: 'strict' (CSRF protect) │          │
│     └───────────────────────────────────┘          │
│                                                     │
│  4. Middleware Protection                           │
│     ┌───────────────────────────────────┐          │
│     │ authMiddleware → verify token     │          │
│     │ adminMiddleware → check role      │          │
│     └───────────────────────────────────┘          │
└─────────────────────────────────────────────────────┘
```

## Request/Response Example

### Successful Login

**Request:**

```
POST /users/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```
HTTP/1.1 200 OK
Set-Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Path=/
Content-Type: application/json

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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Protected Route Access

**Request:**

```
GET /users/profile HTTP/1.1
Host: localhost:3000
Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "...",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```
