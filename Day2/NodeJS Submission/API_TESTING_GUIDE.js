// API Testing Guide
// You can use these examples with Postman, Thunder Client, or curl

// ==============================================
// 1. TEST ROUTE
// ==============================================
/*
GET http://localhost:3000/test

Expected Response:
{
  "message": "This is test route"
}
*/

// ==============================================
// 2. USER SIGNUP
// ==============================================
/*
POST http://localhost:3000/users/signup
Content-Type: application/json

Body:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Expected Response (201):
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

Note: Cookie "authToken" will be set automatically
*/

// ==============================================
// 3. USER LOGIN
// ==============================================
/*
POST http://localhost:3000/users/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Expected Response (200):
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

Note: Cookie "authToken" will be set automatically
*/

// ==============================================
// 4. GET USER PROFILE (Protected)
// ==============================================
/*
GET http://localhost:3000/users/profile

Note: Must be logged in (cookie will be sent automatically)

Expected Response (200):
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

Error Response (401) if not logged in:
{
  "success": false,
  "message": "Access denied. No token provided. Please login first."
}
*/

// ==============================================
// 5. UPDATE PROFILE (Protected)
// ==============================================
/*
PUT http://localhost:3000/users/profile
Content-Type: application/json

Body:
{
  "username": "newusername",
  "email": "newemail@example.com"
}

Expected Response (200):
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
*/

// ==============================================
// 6. LOGOUT (Protected)
// ==============================================
/*
POST http://localhost:3000/users/logout

Expected Response (200):
{
  "success": true,
  "message": "Logout successful"
}

Note: Cookie "authToken" will be cleared
*/

// ==============================================
// 7. CREATE ADMIN USER
// ==============================================
/*
POST http://localhost:3000/users/signup
Content-Type: application/json

Body:
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}

Expected Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "jwt-token-here"
  }
}
*/

// ==============================================
// 8. GET ALL USERS (Admin Only)
// ==============================================
/*
GET http://localhost:3000/users/all

Note: Must be logged in as admin

Expected Response (200):
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "count": 2,
    "users": [
      {
        "id": "...",
        "username": "johndoe",
        "email": "john@example.com",
        "role": "user",
        "createdAt": "...",
        "updatedAt": "..."
      },
      {
        "id": "...",
        "username": "admin",
        "email": "admin@example.com",
        "role": "admin",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}

Error Response (403) if not admin:
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
*/

// ==============================================
// TESTING WORKFLOW
// ==============================================
/*
1. Start the server: npm start
2. Test the test route: GET /test
3. Create a regular user: POST /users/signup
4. Try to access protected route: GET /users/profile (should work)
5. Logout: POST /users/logout
6. Try to access protected route again: GET /users/profile (should fail with 401)
7. Login again: POST /users/login
8. Create an admin user: POST /users/signup with role: "admin"
9. Login as admin: POST /users/login with admin credentials
10. Access admin route: GET /users/all (should work)
11. Logout from admin
12. Login as regular user
13. Try to access admin route: GET /users/all (should fail with 403)
*/

// ==============================================
// CURL EXAMPLES
// ==============================================

// Signup
// curl -X POST http://localhost:3000/users/signup -H "Content-Type: application/json" -d "{\"username\":\"johndoe\",\"email\":\"john@example.com\",\"password\":\"password123\"}" -c cookies.txt

// Login
// curl -X POST http://localhost:3000/users/login -H "Content-Type: application/json" -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}" -c cookies.txt

// Get Profile (uses cookies from login)
// curl -X GET http://localhost:3000/users/profile -b cookies.txt

// Logout
// curl -X POST http://localhost:3000/users/logout -b cookies.txt

