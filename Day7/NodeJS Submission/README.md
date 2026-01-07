# Express.js Deep Dive - Day 7

## Theoretical Questions

### 1. What is Express.js? Why use it over plain Node.js?

**Express.js** is a minimal and flexible Node.js web application framework that provides a robust set of features for building web and mobile applications. It's built on top of Node.js's HTTP module and provides a thin layer of fundamental web application features.

**Why use Express over plain Node.js:**

- **Routing**: Express provides a simple, intuitive routing system. In plain Node.js, you'd need to manually parse URLs and handle routing logic.
- **Middleware**: Express has a powerful middleware system that allows you to modularize your code and handle cross-cutting concerns (logging, authentication, parsing, etc.).
- **Request/Response Helpers**: Express provides convenient methods for handling requests and responses (e.g., `res.json()`, `res.send()`, `req.params`, `req.query`).
- **Template Engines**: Easy integration with template engines like EJS, Pug, Handlebars.
- **Error Handling**: Built-in error handling mechanisms and middleware support.
- **Less Boilerplate**: Reduces the amount of code needed compared to plain Node.js.
- **Ecosystem**: Large community and extensive third-party middleware support.
- **Performance**: Lightweight and fast, with minimal overhead.

**Example Comparison:**

```javascript
// Plain Node.js
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/api/users' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ users: [] }));
  }
});

// Express.js
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});
```

---

### 2. What is middleware in Express? Explain the middleware chain.

**Middleware** in Express are functions that have access to the request object (`req`), response object (`res`), and the `next` function in the application's request-response cycle. Middleware functions can:

- Execute any code
- Make changes to the request and response objects
- End the request-response cycle
- Call the next middleware in the stack

**Middleware Chain:**

The middleware chain is the sequence in which middleware functions are executed. When a request comes in:

1. Request enters the first middleware
2. Middleware processes the request (or response)
3. Calls `next()` to pass control to the next middleware
4. This continues until a middleware sends a response or an error occurs
5. If `next()` is called with an error, the chain jumps to error-handling middleware

**Execution Flow:**

```
Request → Middleware 1 → Middleware 2 → Middleware 3 → Route Handler → Response
           ↓              ↓              ↓
         (next())      (next())      (next())
```

**Example:**

```javascript
app.use((req, res, next) => {
  console.log('Middleware 1');
  next(); // Pass to next middleware
});

app.use((req, res, next) => {
  console.log('Middleware 2');
  next();
});

app.get('/route', (req, res) => {
  res.send('Response');
});
// Output: Middleware 1 → Middleware 2 → Route Handler
```

---

### 3. What are the different types of middleware (application-level, router-level, error-handling)?

#### **Application-Level Middleware**

Applied to the entire application using `app.use()` or `app.METHOD()`. Executes for every request.

```javascript
// Applies to all routes
app.use(express.json());
app.use(logger);

// Applies to specific HTTP method
app.get('/route', handler);
```

#### **Router-Level Middleware**

Applied to specific router instances. Similar to application-level but scoped to a router.

```javascript
const router = express.Router();

router.use(authMiddleware);
router.get('/users', getUsers);
```

#### **Error-Handling Middleware**

Has four parameters `(err, req, res, next)`. Must be defined after all other middleware and routes. Handles errors passed via `next(error)`.

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
```

#### **Built-in Middleware**

Express provides built-in middleware like:
- `express.json()` - Parse JSON bodies
- `express.urlencoded()` - Parse URL-encoded bodies
- `express.static()` - Serve static files

#### **Third-Party Middleware**

External packages like:
- `morgan` - HTTP request logger
- `cors` - Enable CORS
- `helmet` - Security headers
- `compression` - Compress responses

---

### 4. How does error handling work in Express?

Error handling in Express works through **error-handling middleware** and the error propagation mechanism.

**Key Concepts:**

1. **Error-Handling Middleware**: Functions with 4 parameters `(err, req, res, next)`
2. **Error Propagation**: Errors are passed via `next(error)`
3. **Placement**: Error handlers must be defined after all routes and middleware

**How it Works:**

```javascript
// Route that throws an error
app.get('/error', (req, res, next) => {
  const error = new Error('Something went wrong');
  error.status = 400;
  next(error); // Pass error to error handler
});

// Error-handling middleware (must be last)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: err.message
  });
});
```

**Error Handling Strategies:**

1. **Synchronous Errors**: Automatically caught by Express
   ```javascript
   app.get('/route', (req, res) => {
     throw new Error('Error'); // Automatically caught
   });
   ```

2. **Asynchronous Errors**: Must be passed to `next()`
   ```javascript
   app.get('/route', async (req, res, next) => {
     try {
       const data = await asyncOperation();
       res.json(data);
     } catch (error) {
       next(error); // Pass to error handler
     }
   });
   ```

3. **Promise Rejections**: Use wrapper or catch
   ```javascript
   const asyncHandler = (fn) => (req, res, next) => {
     Promise.resolve(fn(req, res, next)).catch(next);
   };
   ```

---

### 5. What is the difference between app.use() and app.all()?

#### **app.use()**

- Used for **middleware** and **mounting** routers
- Matches **all HTTP methods** (GET, POST, PUT, DELETE, etc.)
- Matches routes **starting with** the specified path (prefix matching)
- Can be used without a path (applies to all routes)
- Typically used for cross-cutting concerns (logging, parsing, authentication)

```javascript
app.use('/api', middleware); // Matches /api, /api/users, /api/posts, etc.
app.use(middleware); // Applies to all routes
```

#### **app.all()**

- Used for **route handlers** (not middleware mounting)
- Matches **all HTTP methods** for a specific route
- Matches **exact path** (not prefix)
- Used when you want the same handler for all methods on a specific route

```javascript
app.all('/api/users', handler); // Matches GET, POST, PUT, DELETE /api/users
```

**Key Differences:**

| Feature | app.use() | app.all() |
|---------|-----------|-----------|
| Purpose | Middleware/Router mounting | Route handler |
| Path Matching | Prefix matching | Exact matching |
| Use Case | Cross-cutting concerns | Specific route for all methods |
| Path Optional | Yes | No |

**Examples:**

```javascript
// app.use() - prefix matching
app.use('/api', middleware); // Matches /api, /api/users, /api/posts

// app.all() - exact matching
app.all('/api/users', handler); // Only matches /api/users (all methods)
```

---

### 6. Explain routing in Express. How do route parameters work?

**Routing** in Express determines how an application responds to client requests to a particular endpoint (URI/path) and HTTP method.

**Basic Routing:**

```javascript
app.METHOD(PATH, HANDLER);
// METHOD: get, post, put, delete, etc.
// PATH: route path
// HANDLER: function executed when route is matched
```

**Route Parameters:**

Route parameters are named URL segments used to capture values at specific positions in the URL. They are defined with `:` prefix.

```javascript
// Route with parameter
app.get('/users/:userId', (req, res) => {
  res.json({ userId: req.params.userId });
});

// Request: GET /users/123
// req.params = { userId: '123' }
```

**Multiple Parameters:**

```javascript
app.get('/users/:userId/posts/:postId', (req, res) => {
  res.json({
    userId: req.params.userId,
    postId: req.params.postId
  });
});

// Request: GET /users/123/posts/456
// req.params = { userId: '123', postId: '456' }
```

**Query Parameters:**

```javascript
// Request: GET /search?q=express&page=1
app.get('/search', (req, res) => {
  console.log(req.query); // { q: 'express', page: '1' }
});
```

**Route Methods:**

- `app.get()` - GET requests
- `app.post()` - POST requests
- `app.put()` - PUT requests
- `app.delete()` - DELETE requests
- `app.all()` - All HTTP methods

**Route Paths:**

- String patterns: `/users`
- String patterns with parameters: `/users/:id`
- Regular expressions: `/ab*cd`
- Array of paths: `['/users', '/people']`

---

### 7. What are route handlers vs middleware?

#### **Route Handlers**

- Functions that **handle specific routes** and **send responses**
- Typically the **last function** in the middleware chain
- Usually don't call `next()` (unless chaining multiple handlers)
- Send response using `res.send()`, `res.json()`, `res.render()`, etc.

```javascript
app.get('/users', (req, res) => {
  res.json({ users: [] }); // Route handler - sends response
});
```

#### **Middleware**

- Functions that **process requests** but **don't necessarily send responses**
- Can modify `req` and `res` objects
- **Must call `next()`** to pass control to the next middleware/handler
- Used for cross-cutting concerns (authentication, logging, parsing)

```javascript
app.use((req, res, next) => {
  console.log('Request received');
  next(); // Pass to next middleware/handler
});
```

**Key Differences:**

| Feature | Middleware | Route Handler |
|---------|-----------|---------------|
| Purpose | Process/modify request | Handle and respond |
| next() | Usually calls next() | Usually doesn't call next() |
| Response | May or may not send response | Always sends response |
| Placement | Before route handlers | At the end of chain |

**Chaining:**

```javascript
// Middleware → Route Handler
app.use(authMiddleware); // Middleware
app.get('/users', getUsers); // Route Handler

// Multiple Route Handlers
app.get('/users', 
  (req, res, next) => { // Handler 1
    req.data = 'processed';
    next(); // Pass to next handler
  },
  (req, res) => { // Handler 2
    res.json({ data: req.data });
  }
);
```

---

### 8. How do you handle file uploads in Express?

File uploads in Express are typically handled using middleware like **multer** (for multipart/form-data).

**Using Multer:**

1. **Install multer:**
   ```bash
   npm install multer
   ```

2. **Basic Setup:**
   ```javascript
   const multer = require('multer');
   const upload = multer({ dest: 'uploads/' }); // Store in uploads folder
   ```

3. **Single File Upload:**
   ```javascript
   app.post('/upload', upload.single('file'), (req, res) => {
     res.json({
       message: 'File uploaded',
       file: req.file
     });
   });
   ```

4. **Multiple Files:**
   ```javascript
   app.post('/upload', upload.array('files', 10), (req, res) => {
     res.json({
       files: req.files
     });
   });
   ```

5. **Custom Storage:**
   ```javascript
   const storage = multer.diskStorage({
     destination: (req, file, cb) => {
       cb(null, 'uploads/');
     },
     filename: (req, file, cb) => {
       cb(null, Date.now() + '-' + file.originalname);
     }
   });
   const upload = multer({ storage });
   ```

6. **File Validation:**
   ```javascript
   const upload = multer({
     storage: storage,
     limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
     fileFilter: (req, file, cb) => {
       if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
         cb(null, true);
       } else {
         cb(new Error('Only JPEG and PNG allowed'));
       }
     }
   });
   ```

**Alternative: Formidable or Busboy**

For more control, you can use `formidable` or `busboy` directly.

---

### 9. What is morgan? What logging strategies would you implement?

**Morgan** is a HTTP request logger middleware for Node.js. It logs HTTP requests with various formats and options.

**Basic Usage:**

```javascript
const morgan = require('morgan');
app.use(morgan('combined')); // Apache combined log format
```

**Predefined Formats:**

- `'combined'` - Apache combined log format
- `'common'` - Apache common log format
- `'dev'` - Concise colored output for development
- `'short'` - Shorter than default
- `'tiny'` - Minimal output

**Custom Format:**

```javascript
morgan(':method :url :status :res[content-length] - :response-time ms');
```

**Logging Strategies:**

1. **Environment-Based Logging:**
   ```javascript
   if (process.env.NODE_ENV === 'development') {
     app.use(morgan('dev'));
   } else {
     app.use(morgan('combined'));
   }
   ```

2. **Log to Files:**
   ```javascript
   const fs = require('fs');
   const accessLogStream = fs.createWriteStream(
     path.join(__dirname, 'access.log'),
     { flags: 'a' }
   );
   app.use(morgan('combined', { stream: accessLogStream }));
   ```

3. **Conditional Logging:**
   ```javascript
   app.use(morgan('combined', {
     skip: (req, res) => res.statusCode < 400 // Skip successful requests
   }));
   ```

4. **Structured Logging:**
   ```javascript
   const logger = require('winston');
   app.use(morgan('combined', {
     stream: {
       write: (message) => logger.info(message.trim())
     }
   }));
   ```

5. **Custom Token:**
   ```javascript
   morgan.token('user', (req) => req.user?.username || 'anonymous');
   app.use(morgan(':method :url :status :user'));
   ```

6. **Log Rotation:**
   ```javascript
   const rfs = require('rotating-file-stream');
   const accessLogStream = rfs.createStream('access.log', {
     interval: '1d',
     path: path.join(__dirname, 'logs')
   });
   app.use(morgan('combined', { stream: accessLogStream }));
   ```

**Best Practices:**

- Use `'dev'` format in development
- Use `'combined'` format in production
- Log to files in production
- Implement log rotation
- Filter sensitive data (passwords, tokens)
- Use structured logging for better analysis

---

### 10. How would you structure a large Express application?

For large Express applications, use a **modular, scalable architecture**:

**Recommended Structure:**

```
project/
├── config/
│   ├── database.js
│   ├── env.js
│   └── constants.js
├── controllers/
│   ├── userController.js
│   └── productController.js
├── models/
│   ├── User.js
│   └── Product.js
├── routes/
│   ├── index.js
│   ├── userRoutes.js
│   └── productRoutes.js
├── middleware/
│   ├── auth.js
│   ├── logger.js
│   └── errorHandler.js
├── services/
│   ├── userService.js
│   └── emailService.js
├── utils/
│   ├── validators.js
│   └── helpers.js
├── tests/
│   ├── unit/
│   └── integration/
├── app.js
└── server.js
```

**Key Principles:**

1. **Separation of Concerns:**
   - Controllers: Handle HTTP requests/responses
   - Models: Data structure and database logic
   - Services: Business logic
   - Routes: Route definitions
   - Middleware: Cross-cutting concerns

2. **Modular Routes:**
   ```javascript
   // routes/userRoutes.js
   const express = require('express');
   const router = express.Router();
   const userController = require('../controllers/userController');
   
   router.get('/', userController.getAllUsers);
   router.get('/:id', userController.getUserById);
   router.post('/', userController.createUser);
   
   module.exports = router;
   
   // app.js
   app.use('/api/users', require('./routes/userRoutes'));
   ```

3. **Environment Configuration:**
   ```javascript
   // config/env.js
   module.exports = {
     port: process.env.PORT || 3000,
     db: process.env.DATABASE_URL,
     jwtSecret: process.env.JWT_SECRET
   };
   ```

4. **Error Handling:**
   ```javascript
   // middleware/errorHandler.js
   module.exports = (err, req, res, next) => {
     // Centralized error handling
   };
   ```

5. **Dependency Injection:**
   - Pass dependencies to modules for better testability

6. **Service Layer:**
   ```javascript
   // services/userService.js
   class UserService {
     async createUser(userData) {
       // Business logic here
     }
   }
   ```

7. **Validation:**
   - Use libraries like `joi` or `express-validator`

8. **Testing:**
   - Unit tests for services
   - Integration tests for routes
   - Use Jest or Mocha

**Example app.js:**

```javascript
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(require('./middleware/logger'));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Error handling
app.use(require('./middleware/errorHandler'));

module.exports = app;
```

---

## Machine Coding Question: Custom Middleware Chain

This project implements a custom middleware chain with:

1. **Logging Middleware** (`middleware/logger.js`) - Logs request details
2. **Authentication Middleware** (`middleware/auth.js`) - Validates authentication tokens
3. **Request Timing Middleware** (`middleware/timing.js`) - Measures request processing time
4. **Error Handling Middleware** (`middleware/errorHandler.js`) - Handles errors gracefully

### How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

3. Test the endpoints:
   - `GET http://localhost:3000/` - Welcome message
   - `GET http://localhost:3000/public` - Public route (no auth)
   - `GET http://localhost:3000/protected` - Protected route (requires auth)
   - `GET http://localhost:3000/admin` - Admin route (requires auth)
   - `GET http://localhost:3000/error` - Test error handling
   - `GET http://localhost:3000/crash` - Test unhandled error

### Testing with Authentication

For protected routes, include the Authorization header:
```
Authorization: Bearer valid-token-123
```

Example using curl:
```bash
curl -H "Authorization: Bearer valid-token-123" http://localhost:3000/protected
```

### Features

- ✅ Logging middleware logs all requests
- ✅ Authentication middleware protects specific routes
- ✅ Timing middleware measures response time
- ✅ Error handling middleware catches and formats errors
- ✅ Proper error propagation through middleware chain
- ✅ 404 handling for undefined routes

