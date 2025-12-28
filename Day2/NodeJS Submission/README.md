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

---

## Theoretical Questions & Answers

### 1. What is HTTPS? How does it differ from HTTP?

**HTTPS (Hypertext Transfer Protocol Secure)** is the secure version of HTTP, the protocol used for transferring data between a web browser and a website.

**Key Differences:**

| Feature               | HTTP                    | HTTPS                        |
| --------------------- | ----------------------- | ---------------------------- |
| **Security**          | No encryption           | Encrypted communication      |
| **Port**              | 80                      | 443                          |
| **Protocol**          | HTTP only               | HTTP + SSL/TLS               |
| **Data Safety**       | Plain text (vulnerable) | Encrypted (secure)           |
| **Certificate**       | Not required            | SSL/TLS certificate required |
| **SEO Ranking**       | Lower                   | Higher (Google favors HTTPS) |
| **Browser Indicator** | "Not Secure" warning    | Padlock icon 🔒              |

**How HTTPS Works:**

1. Client requests secure connection
2. Server sends SSL certificate
3. Client validates certificate
4. Encrypted connection established
5. All data transmitted is encrypted

**Benefits:**

- ✅ Protects sensitive data (passwords, credit cards)
- ✅ Prevents man-in-the-middle attacks
- ✅ Authenticates the website
- ✅ Builds user trust
- ✅ Required for modern web features (PWA, geolocation)

---

### 2. Explain SSL/TLS. What is the SSL handshake process?

**SSL (Secure Sockets Layer)** and **TLS (Transport Layer Security)** are cryptographic protocols that provide secure communication over a network.

**Note:** SSL is the older protocol, now deprecated. TLS is the modern, more secure version. People often say "SSL" but mean "TLS."

**SSL/TLS Handshake Process:**

```
Client                                Server
  |                                     |
  |  1. Client Hello                    |
  |  (Supported cipher suites, TLS ver) |
  |------------------------------------>|
  |                                     |
  |  2. Server Hello                    |
  |  (Selected cipher, TLS version)     |
  |<------------------------------------|
  |                                     |
  |  3. Server Certificate              |
  |  (Public key + CA signature)        |
  |<------------------------------------|
  |                                     |
  |  4. Client Verifies Certificate     |
  |  (Checks CA, validity, domain)      |
  |                                     |
  |  5. Client Key Exchange             |
  |  (Encrypted pre-master secret)      |
  |------------------------------------>|
  |                                     |
  |  6. Both Generate Session Keys      |
  |  (Using pre-master secret)          |
  |                                     |
  |  7. Finished Messages               |
  |  (Encrypted with session keys)      |
  |<----------------------------------->|
  |                                     |
  |  8. Secure Connection Established   |
  |  All data now encrypted             |
  |<----------------------------------->|
```

**Detailed Steps:**

1. **Client Hello:** Client sends supported TLS versions and cipher suites
2. **Server Hello:** Server chooses TLS version and cipher suite
3. **Certificate:** Server sends its SSL certificate (contains public key)
4. **Key Exchange:** Client generates pre-master secret, encrypts it with server's public key
5. **Session Keys:** Both sides generate symmetric session keys from pre-master secret
6. **Finished:** Both send encrypted "finished" messages to verify handshake
7. **Secure Communication:** All subsequent data encrypted with session keys

**Key Points:**

- Handshake uses asymmetric encryption (slow but secure)
- Actual data transfer uses symmetric encryption (fast)
- Session keys are temporary and unique per session

---

### 3. What is encryption? Explain symmetric vs asymmetric encryption.

**Encryption** is the process of converting readable data (plaintext) into an unreadable format (ciphertext) to protect it from unauthorized access.

**Symmetric Encryption:**

Uses the **same key** for both encryption and decryption.

```
Plaintext → [Encrypt with Key] → Ciphertext
Ciphertext → [Decrypt with Same Key] → Plaintext
```

**Examples:** AES, DES, 3DES, Blowfish

**Pros:**

- ✅ Fast and efficient
- ✅ Good for large data
- ✅ Less computational overhead

**Cons:**

- ❌ Key distribution problem (how to share key securely?)
- ❌ Need separate key for each pair of users
- ❌ If key is compromised, all data is exposed

**Use Cases:**

- Database encryption
- File encryption
- Session encryption (after SSL handshake)

---

**Asymmetric Encryption (Public-Key Cryptography):**

Uses **two different keys**: a public key (for encryption) and a private key (for decryption).

```
Public Key (shared openly)
   ↓
Plaintext → [Encrypt with Public Key] → Ciphertext
   ↓
Ciphertext → [Decrypt with Private Key] → Plaintext
```

**Examples:** RSA, ECC, DSA

**How it Works:**

- Public key can encrypt, but cannot decrypt
- Only the corresponding private key can decrypt
- Private key must be kept secret

**Pros:**

- ✅ Solves key distribution problem
- ✅ More secure key exchange
- ✅ Enables digital signatures
- ✅ Each user needs only one key pair

**Cons:**

- ❌ Slower than symmetric encryption
- ❌ Not suitable for large data
- ❌ More computational overhead

**Use Cases:**

- SSL/TLS handshake
- Digital signatures
- Key exchange
- Email encryption (PGP)

---

**Comparison Table:**

| Feature              | Symmetric               | Asymmetric                    |
| -------------------- | ----------------------- | ----------------------------- |
| **Keys**             | One key                 | Two keys (public/private)     |
| **Speed**            | Fast                    | Slower                        |
| **Key Distribution** | Difficult               | Easy                          |
| **Security**         | Good if key kept secret | Very secure                   |
| **Data Size**        | Large data              | Small data (keys, signatures) |
| **Example**          | AES-256                 | RSA-2048                      |
| **Use Case**         | Bulk data encryption    | Key exchange, signatures      |

**Real-World Usage:**

Most systems use **both**:

1. Asymmetric encryption to securely exchange a symmetric key (SSL handshake)
2. Symmetric encryption for actual data transfer (faster)

This is called **hybrid encryption** and is used in HTTPS, VPNs, etc.

---

### 4. What are certificates? What is a Certificate Authority (CA)?

**SSL/TLS Certificate:**

A digital certificate is an electronic document that proves the ownership of a public key. It contains:

```
Certificate Contents:
├── Domain name (e.g., example.com)
├── Organization details
├── Public key
├── Certificate Authority (CA) information
├── Validity period (expiration date)
├── Digital signature (from CA)
└── Certificate fingerprint
```

**Purpose:**

- Verifies website identity
- Enables encrypted HTTPS connection
- Prevents man-in-the-middle attacks
- Builds user trust

---

**Certificate Authority (CA):**

A **Certificate Authority** is a trusted third-party organization that issues and verifies digital certificates.

**Well-Known CAs:**

- DigiCert
- Let's Encrypt (free)
- Comodo
- GoDaddy
- GlobalSign

**How CA Verification Works:**

```
1. Website Owner:
   Creates Certificate Signing Request (CSR)
   ↓
2. Sends CSR to CA:
   Includes domain name, public key, organization info
   ↓
3. CA Verifies:
   Validates domain ownership
   Checks organization details
   ↓
4. CA Issues Certificate:
   Signs certificate with CA's private key
   ↓
5. Website Installs Certificate:
   On web server
   ↓
6. Browser Validation:
   When user visits, browser checks:
   - Is certificate signed by trusted CA?
   - Is certificate valid (not expired)?
   - Does domain match?
   ↓
7. Result:
   ✅ Valid → Secure connection (🔒)
   ❌ Invalid → Warning shown
```

**Certificate Types:**

1. **Domain Validated (DV)**

   - Verifies domain ownership only
   - Fastest and cheapest
   - Issued in minutes
   - Example: Let's Encrypt

2. **Organization Validated (OV)**

   - Verifies domain + organization
   - Shows organization name
   - Takes 1-3 days

3. **Extended Validation (EV)**
   - Highest validation level
   - Extensive verification process
   - Shows green address bar (older browsers)
   - Most expensive
   - Example: Banks, financial sites

**Certificate Chain of Trust:**

```
Root CA Certificate (Built into browsers/OS)
    ↓
Intermediate CA Certificate
    ↓
End-Entity Certificate (Your website)
```

Browsers trust your certificate because it's signed by a CA they already trust.

---

### 5. What is the difference between authentication and authorization?

**Authentication** and **Authorization** are two different concepts in security:

**Authentication (Who are you?):**

The process of **verifying the identity** of a user or system.

**Question it answers:** "Who are you?"

**Examples:**

- Login with username/password
- Biometric verification (fingerprint, face ID)
- Two-factor authentication (2FA)
- JWT token verification
- OAuth login (Google, Facebook)

**Process:**

```
User provides credentials
    ↓
System verifies credentials
    ↓
If valid → User is authenticated
If invalid → Access denied
```

---

**Authorization (What can you do?):**

The process of **determining what an authenticated user is allowed to do**.

**Question it answers:** "What are you allowed to access?"

**Examples:**

- Admin can delete users
- Regular user can only view their own profile
- Premium users can access premium features
- Guest users have read-only access

**Process:**

```
User is already authenticated
    ↓
User tries to access resource
    ↓
System checks user's permissions/roles
    ↓
If authorized → Access granted
If not authorized → 403 Forbidden
```

---

**Comparison Table:**

| Aspect          | Authentication                  | Authorization                |
| --------------- | ------------------------------- | ---------------------------- |
| **Definition**  | Verifying identity              | Verifying permissions        |
| **Question**    | "Who are you?"                  | "What can you do?"           |
| **When**        | First step                      | After authentication         |
| **How**         | Credentials, tokens, biometrics | Roles, permissions, policies |
| **Result**      | User is identified              | User gets access rights      |
| **HTTP Status** | 401 Unauthorized                | 403 Forbidden                |
| **Example**     | Login with password             | Admin accessing admin panel  |

---

**Real-World Example:**

```javascript
// AUTHENTICATION: Verify who the user is
app.post('/login', (req, res) => {
    const { email, password } = req.body

    // Verify credentials
    const user = await User.findOne({ email })
    const isValid = await bcrypt.compare(password, user.password)

    if (isValid) {
        // User is AUTHENTICATED
        const token = generateToken(user.id)
        res.json({ token })
    } else {
        res.status(401).json({ error: 'Invalid credentials' })
    }
})

// AUTHORIZATION: Check what user can do
app.delete('/users/:id', authMiddleware, (req, res) => {
    // User is already AUTHENTICATED (from authMiddleware)

    // Now check AUTHORIZATION
    if (req.user.role !== 'admin') {
        // User is authenticated but NOT AUTHORIZED
        return res.status(403).json({ error: 'Admin access required' })
    }

    // User is both authenticated AND authorized
    await User.deleteById(req.params.id)
    res.json({ message: 'User deleted' })
})
```

**Key Points:**

- Authentication must happen **before** authorization
- A user can be authenticated but **not authorized**
- Authentication = Identity verification
- Authorization = Permission verification

---

### 6. Explain session-based authentication. How do sessions work?

**Session-Based Authentication** is a stateful authentication method where the server stores user session data.

**How Sessions Work:**

```
┌──────────┐                           ┌──────────┐
│  Client  │                           │  Server  │
└────┬─────┘                           └────┬─────┘
     │                                      │
     │  1. Login (username/password)        │
     │─────────────────────────────────────>│
     │                                      │
     │                        2. Verify credentials
     │                        3. Create session in memory/DB
     │                        4. Generate session ID
     │                                      │
     │  5. Set-Cookie: sessionId=abc123     │
     │<─────────────────────────────────────│
     │                                      │
     │  6. Request with Cookie              │
     │     Cookie: sessionId=abc123         │
     │─────────────────────────────────────>│
     │                                      │
     │                        7. Lookup session by ID
     │                        8. Retrieve user data from session
     │                        9. Process request
     │                                      │
     │  10. Response                        │
     │<─────────────────────────────────────│
```

**Detailed Process:**

**Step 1: User Login**

```javascript
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Verify credentials
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Create session
  const sessionId = generateRandomId();
  sessions[sessionId] = {
    userId: user.id,
    username: user.username,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  };

  // Send session ID as cookie
  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.json({ message: "Login successful" });
});
```

**Step 2: Subsequent Requests**

```javascript
// Middleware to check session
const sessionMiddleware = (req, res, next) => {
  const sessionId = req.cookies.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Lookup session
  const session = sessions[sessionId];

  if (!session) {
    return res.status(401).json({ error: "Invalid session" });
  }

  // Check if expired
  if (new Date() > session.expiresAt) {
    delete sessions[sessionId];
    return res.status(401).json({ error: "Session expired" });
  }

  // Attach user to request
  req.user = session;
  next();
};

// Protected route
app.get("/profile", sessionMiddleware, (req, res) => {
  res.json({ user: req.user });
});
```

**Step 3: Logout**

```javascript
app.post("/logout", (req, res) => {
  const sessionId = req.cookies.sessionId;

  // Delete session from server
  delete sessions[sessionId];

  // Clear cookie
  res.clearCookie("sessionId");

  res.json({ message: "Logged out" });
});
```

---

**Session Storage Options:**

1. **In-Memory (Simple but not scalable)**

```javascript
const sessions = {}; // Lost on server restart
```

2. **Database (MySQL, PostgreSQL)**

```sql
CREATE TABLE sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id INT,
    data JSON,
    expires_at TIMESTAMP
);
```

3. **Redis (Fast, scalable)**

```javascript
// Store session
await redis.set(`session:${sessionId}`, JSON.stringify(userData), "EX", 86400);

// Retrieve session
const userData = JSON.parse(await redis.get(`session:${sessionId}`));
```

---

**Pros of Session-Based Auth:**

✅ Server has full control (can invalidate sessions anytime)  
✅ Session data can be complex  
✅ More secure (session data not sent to client)  
✅ Easy to implement logout  
✅ Can track active sessions

**Cons of Session-Based Auth:**

❌ **Stateful** - server must store sessions (memory/database)  
❌ Scaling is complex (need shared session store)  
❌ Server storage required  
❌ Cookies may not work well with mobile apps  
❌ CSRF vulnerability

**When to Use Sessions:**

- Traditional web applications
- When you need server-side session management
- When you want to track active users
- When you need to invalidate sessions instantly
- Server-rendered applications (PHP, Rails, Django)

---

### 7. What are cookies? What are the security attributes of cookies?

**Cookies** are small pieces of data that a server sends to a user's browser, which the browser stores and sends back with subsequent requests to the same server.

**Cookie Structure:**

```
Set-Cookie: name=value; Domain=example.com; Path=/; Expires=Wed, 21 Oct 2025 07:28:00 GMT; HttpOnly; Secure; SameSite=Strict
```

---

**Security Attributes of Cookies:**

#### 1. **HttpOnly**

Prevents JavaScript from accessing the cookie via `document.cookie`.

```javascript
// Setting HttpOnly cookie
res.cookie("authToken", token, {
  httpOnly: true, // Cannot be accessed by JavaScript
});
```

**Protection:**

- ✅ Prevents XSS attacks
- ✅ Cookie can only be accessed by server
- ✅ JavaScript cannot steal the cookie

**Example:**

```javascript
// With HttpOnly: false
document.cookie; // "authToken=abc123..."

// With HttpOnly: true
document.cookie; // "" (cookie hidden from JavaScript)
```

---

#### 2. **Secure**

Ensures cookie is only sent over HTTPS connections.

```javascript
res.cookie("authToken", token, {
  secure: true, // Only sent over HTTPS
});
```

**Protection:**

- ✅ Prevents man-in-the-middle attacks
- ✅ Cookie cannot be intercepted on HTTP
- ✅ Essential for production environments

**Note:** Set `secure: process.env.NODE_ENV === 'production'` for development flexibility.

---

#### 3. **SameSite**

Controls when cookies are sent with cross-site requests.

**Values:**

**a) `SameSite=Strict`** (Most secure)

```javascript
res.cookie("authToken", token, {
  sameSite: "strict",
});
```

- Cookie **never** sent on cross-site requests
- Only sent when navigating to the origin site
- Best protection against CSRF
- May break some legitimate cross-site flows

**b) `SameSite=Lax`** (Balanced)

```javascript
res.cookie("authToken", token, {
  sameSite: "lax",
});
```

- Cookie sent on top-level navigation (clicking links)
- Not sent on embedded requests (images, iframes)
- Good balance between security and usability

**c) `SameSite=None`** (Least secure)

```javascript
res.cookie("authToken", token, {
  sameSite: "none",
  secure: true, // Required when SameSite=None
});
```

- Cookie sent on all requests (same-site and cross-site)
- Used for cross-site cookies (OAuth, ads, analytics)
- Must be combined with `Secure` attribute

**Protection:**

- ✅ Prevents CSRF attacks
- ✅ Controls cross-origin cookie sending

---

#### 4. **Domain**

Specifies which domains can access the cookie.

```javascript
res.cookie("authToken", token, {
  domain: ".example.com", // Accessible to all subdomains
});
```

**Examples:**

- `domain=example.com` → accessible to example.com and all subdomains
- No domain set → accessible only to the exact domain

---

#### 5. **Path**

Specifies which URL paths can access the cookie.

```javascript
res.cookie("authToken", token, {
  path: "/api", // Only accessible at /api/* routes
});
```

**Examples:**

- `path=/` → accessible to all paths (most common)
- `path=/admin` → only accessible to /admin/\* routes

---

#### 6. **Expires / Max-Age**

Sets cookie expiration.

```javascript
// Using Expires
res.cookie("authToken", token, {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
});

// Using Max-Age (in seconds)
res.cookie("authToken", token, {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
});
```

**No expiration** = Session cookie (deleted when browser closes)

---

**Complete Secure Cookie Example:**

```javascript
app.post("/login", async (req, res) => {
  // ... authenticate user ...

  const token = generateToken(user.id);

  res.cookie("authToken", token, {
    httpOnly: true, // No JavaScript access
    secure: true, // HTTPS only
    sameSite: "strict", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/", // All paths
    // domain: '.example.com'  // Optional: for subdomains
  });

  res.json({ message: "Login successful" });
});
```

---

**Common Cookie Attacks & Protections:**

| Attack                                | Protection                           |
| ------------------------------------- | ------------------------------------ |
| **XSS (Cross-Site Scripting)**        | `HttpOnly` attribute                 |
| **CSRF (Cross-Site Request Forgery)** | `SameSite` attribute                 |
| **Man-in-the-Middle**                 | `Secure` attribute (HTTPS)           |
| **Cookie Theft**                      | All attributes combined              |
| **Session Hijacking**                 | Short expiration + secure attributes |

---

**Best Practices:**

1. ✅ Always use `HttpOnly` for auth cookies
2. ✅ Always use `Secure` in production
3. ✅ Use `SameSite=Strict` or `Lax`
4. ✅ Set appropriate expiration
5. ✅ Use HTTPS in production
6. ✅ Regenerate session ID after login
7. ✅ Clear cookies on logout

---

### 8. What is token-based authentication? How does it differ from session-based auth?

**Token-Based Authentication** is a stateless authentication method where the server generates a token (usually JWT) that contains user information, and the client stores and sends this token with each request.

**How Token-Based Authentication Works:**

```
┌──────────┐                           ┌──────────┐
│  Client  │                           │  Server  │
└────┬─────┘                           └────┬─────┘
     │                                      │
     │  1. Login (username/password)        │
     │─────────────────────────────────────>│
     │                                      │
     │                        2. Verify credentials
     │                        3. Generate JWT token
     │                        4. Sign token with secret
     │                                      │
     │  5. Return token (no server storage) │
     │<─────────────────────────────────────│
     │                                      │
     │  6. Store token (localStorage)       │
     │     token = "eyJhbG..."              │
     │                                      │
     │  7. Request with Authorization header│
     │     Authorization: Bearer eyJhbG...  │
     │─────────────────────────────────────>│
     │                                      │
     │                        8. Verify token signature
     │                        9. Decode token to get user info
     │                        10. Process request
     │                                      │
     │  11. Response                        │
     │<─────────────────────────────────────│
```

---

**JWT Token Structure:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJpYXQiOjE2MDk0NTkyMDB9.signature

Header.Payload.Signature
```

**Decoded JWT:**

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "123",
    "email": "user@example.com",
    "role": "admin",
    "iat": 1609459200,
    "exp": 1609545600
  },
  "signature": "calculated_signature"
}
```

---

**Implementation Example:**

```javascript
// Login - Generate Token
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Verify credentials
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Generate JWT token (NO server storage)
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  // Return token to client
  res.json({ token, tokenType: "Bearer" });
});

// Middleware - Verify Token
const tokenAuth = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify and decode token (NO database lookup needed)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // User info is in the token itself
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    res.status(401).json({ error: "Invalid token" });
  }
};

// Protected route
app.get("/profile", tokenAuth, (req, res) => {
  // User info already in req.user from token
  res.json({ user: req.user });
});
```

---

**Session-Based vs Token-Based Authentication:**

| Feature           | Session-Based                      | Token-Based                       |
| ----------------- | ---------------------------------- | --------------------------------- |
| **State**         | Stateful (server stores sessions)  | Stateless (no server storage)     |
| **Storage**       | Server memory/database             | Client-side (localStorage/memory) |
| **Scalability**   | Harder (need shared session store) | Easy (no server state)            |
| **Mobile Apps**   | Limited support                    | Excellent support                 |
| **CSRF**          | Vulnerable                         | Not vulnerable                    |
| **XSS**           | Less vulnerable (HttpOnly cookies) | More vulnerable (token in JS)     |
| **Logout**        | Easy (delete session)              | Harder (need token blacklist)     |
| **Expiration**    | Server controls                    | Token contains expiry             |
| **Data Transfer** | Only session ID                    | Entire token (larger)             |
| **Server Load**   | Higher (session lookups)           | Lower (just verify signature)     |
| **Microservices** | Complex                            | Simple                            |
| **Cross-Domain**  | Difficult                          | Easy                              |

---

**Detailed Comparison:**

**1. State Management:**

**Session:**

```javascript
// Server stores session
sessions[sessionId] = { userId: 123, username: "john" };
```

**Token:**

```javascript
// No server storage, data in token
token = { userId: 123, username: "john" }; // Encoded in JWT
```

---

**2. Scalability:**

**Session:**

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Server1 │    │ Server2 │    │ Server3 │
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     └──────┬───────┴──────┬───────┘
            │              │
       ┌────▼────┐    ┌────▼────┐
       │  Redis  │ or │ Memcache│
       │(Shared) │    │(Shared) │
       └─────────┘    └─────────┘

Need shared session store for load balancing
```

**Token:**

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│ Server1 │    │ Server2 │    │ Server3 │
└────┬────┘    └────┬────┘    └────┬────┘
     │              │              │
     └──────────────┴──────────────┘

Each server can verify tokens independently
No shared storage needed
```

---

**3. Logout:**

**Session:**

```javascript
// Easy logout
app.post("/logout", (req, res) => {
  delete sessions[req.cookies.sessionId];
  res.clearCookie("sessionId");
  res.json({ message: "Logged out" });
});
```

**Token:**

```javascript
// Need token blacklist
app.post("/logout", tokenAuth, async (req, res) => {
  // Add token to blacklist
  await redis.set(`blacklist:${token}`, "1", "EX", remainingTime);
  res.json({ message: "Logged out" });
});

// Check blacklist in middleware
const tokenAuth = async (req, res, next) => {
  const token = getToken(req);

  // Check if token is blacklisted
  const isBlacklisted = await redis.get(`blacklist:${token}`);
  if (isBlacklisted) {
    return res.status(401).json({ error: "Token revoked" });
  }

  // Verify token...
};
```

---

**4. Mobile Apps:**

**Session:**

- Cookies work differently on mobile
- Requires special handling
- Some platforms don't support cookies well

**Token:**

- Works perfectly on all platforms
- Just include in Authorization header
- Native support in React Native, Flutter, etc.

```javascript
// Mobile app (React Native)
fetch("https://api.example.com/profile", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

**When to Use Each:**

**Use Session-Based When:**

- ✅ Building traditional server-rendered web app
- ✅ Need instant session invalidation
- ✅ Single-server or simple architecture
- ✅ Strong protection against XSS is priority
- ✅ Users primarily on web browsers

**Use Token-Based When:**

- ✅ Building REST API
- ✅ Supporting mobile apps
- ✅ Building microservices
- ✅ Need horizontal scalability
- ✅ Cross-domain requests
- ✅ Stateless architecture
- ✅ Building SPA (React, Vue, Angular)

---

**Hybrid Approach (Best of Both):**

```javascript
// Use tokens but store refresh tokens server-side
app.post("/login", async (req, res) => {
  // Generate access token (short-lived)
  const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, {
    expiresIn: "15m",
  });

  // Generate refresh token (long-lived)
  const refreshToken = generateRandomToken();

  // Store refresh token server-side
  await db.storeRefreshToken(user.id, refreshToken);

  res.json({ accessToken, refreshToken });
});

// Refresh endpoint
app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  // Verify refresh token (server lookup)
  const userId = await db.validateRefreshToken(refreshToken);

  // Generate new access token
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });

  res.json({ accessToken });
});
```

This combines:

- Fast token verification (stateless)
- Ability to revoke access (refresh tokens)
- Short access token expiry (security)
- Long refresh token lifetime (UX)

---

**Summary:**

Both authentication methods are valid and widely used. Choose based on:

- Your application architecture
- Scalability requirements
- Platform support needed (web/mobile)
- Security priorities
- Team expertise

Modern applications often use **token-based authentication** for APIs and mobile apps, while traditional web applications may still use **session-based authentication** for simplicity.
