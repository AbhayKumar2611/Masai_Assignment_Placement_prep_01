# Validation & Error Handler System

An Express API with MongoDB implementing custom validation middleware and centralized error handling. Includes validation for user registration (email, password strength, age) and a comprehensive error handling system with custom error classes.

## Features

### Validation:
- **Email Validation**: Format validation using regex
- **Password Strength Validation**: Minimum 8 characters, uppercase, lowercase, number, special character
- **Age Validation**: Minimum 18, maximum 120
- **Input Sanitization**: Trims whitespace, converts email to lowercase
- **Custom Validation Errors**: Detailed field-level error messages

### Error Handling:
- **Centralized Error Handler**: Consistent error response format
- **Custom Error Classes**: BadRequest, Unauthorized, Forbidden, NotFound, Conflict, ValidationError, InternalServerError
- **Development vs Production**: Different error responses based on environment
- **Error Handling Wrapper**: `catchAsync` for async route handlers
- **Unhandled Rejection/Exception Handlers**: Process-level error handlers

### CRUD Operations:
- User registration with validation
- Get all users
- Get user by ID
- Update user
- Delete user

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file:

```env
MONGO_URL=mongodb://localhost:27017/validationDB
PORT=3000
NODE_ENV=development
```

## Running the Server

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
```
GET /health
```

### Register User (with Validation)
```
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "StrongPass123!",
  "age": 25,
  "name": "John Doe"
}
```

**Validation Rules:**
- Email: Valid email format required
- Password: Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
- Age: Between 18 and 120

### Get All Users
```
GET /api/users
```

### Get User by ID
```
GET /api/users/:id
```

### Update User
```
PUT /api/users/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "age": 30
}
```

### Delete User
```
DELETE /api/users/:id
```

## Example Requests

### Valid Registration
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "StrongPass123!",
    "age": 25,
    "name": "John Doe"
  }'
```

### Invalid Registration (Validation Error)
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "weak",
    "age": 15
  }'
```

**Response:**
```json
{
  "success": false,
  "status": "fail",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    },
    {
      "field": "password",
      "message": "Password must contain at least one uppercase letter"
    },
    {
      "field": "age",
      "message": "Age must be at least 18"
    }
  ]
}
```

## Project Structure

```
Day10/NodeJS Submission/
├── configs/
│   └── mongo.db.js          # MongoDB connection
├── controllers/
│   ├── product.controller.js
│   └── user.controller.js   # User CRUD operations
├── errors/
│   ├── AppError.js          # Base error class
│   └── CustomErrors.js      # Custom error classes
├── middleware/
│   ├── errorHandler.js      # Centralized error handler
│   └── validation.middleware.js  # Validation middleware
├── models/
│   ├── product.model.js
│   └── user.model.js        # User schema
├── routes/
│   ├── product.routes.js
│   └── user.routes.js       # User routes
├── server.js                # Express app setup
├── package.json
└── README.md
```

## Custom Error Classes

The system includes the following custom error classes:

- **BadRequestError (400)**: Invalid input, bad request
- **UnauthorizedError (401)**: Authentication required or failed
- **ForbiddenError (403)**: Permission denied
- **NotFoundError (404)**: Resource not found
- **ConflictError (409)**: Duplicate resource, conflict
- **ValidationError (422)**: Validation failures with field-level errors
- **InternalServerError (500)**: Unexpected server errors

## Error Response Format

### Development Mode
```json
{
  "success": false,
  "status": "fail",
  "error": { ...full error object... },
  "message": "Error message",
  "stack": "Error stack trace"
}
```

### Production Mode
```json
{
  "success": false,
  "status": "fail",
  "message": "Error message",
  "errors": [...]  // Only for validation errors
}
```

---

# Theoretical Questions

## 1. What are the types of errors in Node.js?

**Errors in Node.js** can be categorized into several types:

### Error Types:

1. **Standard Error**: JavaScript `Error` object
   ```javascript
   throw new Error('Something went wrong')
   ```

2. **TypeError**: Invalid type operations
   ```javascript
   undefined.map() // TypeError: Cannot read property 'map' of undefined
   ```

3. **ReferenceError**: Accessing undefined variables
   ```javascript
   console.log(undefinedVariable) // ReferenceError
   ```

4. **SyntaxError**: Invalid JavaScript syntax
   ```javascript
   const x = { // Missing closing brace
   ```

5. **RangeError**: Value outside valid range
   ```javascript
   new Array(-1) // RangeError: Invalid array length
   ```

6. **System Errors**: Operating system errors (file system, network)
   ```javascript
   // ENOENT: No such file or directory
   // ECONNREFUSED: Connection refused
   ```

7. **Operational Errors**: Expected errors (user input, network issues)
8. **Programmer Errors**: Bugs in code (undefined variables, logic errors)

---

## 2. How do you handle errors in synchronous vs asynchronous code?

### Synchronous Code Error Handling:

**Use try-catch blocks:**
```javascript
try {
    const result = riskyOperation()
    console.log(result)
} catch (error) {
    console.error('Error:', error.message)
}
```

### Asynchronous Code Error Handling:

**1. Callbacks (Error-first pattern):**
```javascript
fs.readFile('file.txt', (err, data) => {
    if (err) {
        console.error('Error:', err)
        return
    }
    console.log(data)
})
```

**2. Promises (.catch()):**
```javascript
someAsyncFunction()
    .then(result => console.log(result))
    .catch(error => console.error('Error:', error))
```

**3. Async/Await (try-catch):**
```javascript
async function handleAsync() {
    try {
        const result = await someAsyncFunction()
        console.log(result)
    } catch (error) {
        console.error('Error:', error)
    }
}
```

**4. Express with catchAsync wrapper:**
```javascript
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

const handler = catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id)
    res.json(user)
})
```

---

## 3. What is the try-catch block? When should you use it?

**try-catch** is a JavaScript construct for handling exceptions in synchronous code and async/await.

### Syntax:
```javascript
try {
    // Code that might throw an error
    riskyOperation()
} catch (error) {
    // Handle the error
    console.error(error)
} finally {
    // Always executes (optional)
    cleanup()
}
```

### When to Use:

1. **Synchronous Operations**: Catching thrown errors
   ```javascript
   try {
       JSON.parse(invalidJson)
   } catch (error) {
       console.error('Invalid JSON')
   }
   ```

2. **Async/Await**: Handling promise rejections
   ```javascript
   try {
       const data = await fetchData()
   } catch (error) {
       console.error('Failed to fetch:', error)
   }
   ```

3. **Input Validation**: Validating user input before processing
4. **External APIs**: Handling API failures gracefully
5. **File Operations**: Handling file read/write errors

### When NOT to Use:

- **Promises with .catch()**: Use `.catch()` instead of try-catch
- **Event Emitters**: Use error event handlers
- **Callbacks**: Use error-first callback pattern

---

## 4. How do you handle unhandled promise rejections?

**Unhandled Promise Rejections** occur when a promise is rejected but no `.catch()` handler exists.

### Handling Methods:

**1. Process-Level Handler:**
```javascript
process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED REJECTION:', reason)
    // Log error, send to monitoring service
    // Optionally: close server gracefully
    server.close(() => {
        process.exit(1)
    })
})
```

**2. Always Use .catch():**
```javascript
someAsyncFunction()
    .then(result => console.log(result))
    .catch(error => {
        console.error('Handled:', error)
    })
```

**3. Use catchAsync Wrapper:**
```javascript
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}
```

**4. Global Handler in Express:**
```javascript
// In server.js
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! Shutting down...')
    console.log(err.name, err.message)
    server.close(() => {
        process.exit(1)
    })
})
```

### Best Practices:
- Always handle promise rejections
- Use async/await with try-catch
- Set up process-level handlers as safety net
- Log errors for debugging
- Gracefully shutdown on critical errors

---

## 5. What are operational errors vs programmer errors?

### Operational Errors:
**Expected errors** that occur during normal operation, can be handled gracefully.

**Examples:**
- Invalid user input (validation failures)
- Network failures (API timeouts)
- File not found (missing files)
- Database connection errors
- Authentication failures

**Characteristics:**
- Can be anticipated and handled
- Should return meaningful error messages
- Don't indicate bugs in code
- Should be logged but not necessarily crash the app

```javascript
// Operational error
if (!email || !isValidEmail(email)) {
    throw new ValidationError('Invalid email format')
}
```

### Programmer Errors:
**Bugs in code** that indicate programming mistakes, should be fixed in development.

**Examples:**
- Accessing undefined variables
- Calling methods on null/undefined
- Type errors (wrong data types)
- Logic errors
- Syntax errors

**Characteristics:**
- Indicate bugs that need fixing
- Should crash the application in development
- Should be caught during testing
- Need code fixes, not error handling

```javascript
// Programmer error
const user = undefined
user.name // TypeError: Cannot read property 'name' of undefined
```

### Handling Strategy:
- **Operational Errors**: Handle gracefully, return error responses
- **Programmer Errors**: Fix the code, use linters and tests to prevent

---

## 6. How would you implement centralized error handling in Express?

**Centralized error handling** uses a single error handler middleware to format all errors consistently.

### Implementation Steps:

**1. Create Error Handler Middleware:**
```javascript
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        // Detailed error in development
        res.status(err.statusCode).json({
            success: false,
            error: err,
            message: err.message,
            stack: err.stack
        })
    } else {
        // Sanitized error in production
        if (err.isOperational) {
            res.status(err.statusCode).json({
                success: false,
                message: err.message
            })
        } else {
            res.status(500).json({
                success: false,
                message: 'Something went wrong!'
            })
        }
    }
}
```

**2. Use After All Routes:**
```javascript
// Routes
app.use('/api/users', userRoutes)

// Error handler (must be last)
app.use(errorHandler)
```

**3. Use catchAsync Wrapper:**
```javascript
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

const getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    // Errors automatically passed to error handler
    res.json(user)
})
```

**4. Throw Custom Errors:**
```javascript
if (!user) {
    return next(new NotFoundError('User not found'))
}
```

### Benefits:
- Consistent error format
- Single place to modify error responses
- Environment-specific error details
- Cleaner route handlers

---

## 7. What is input validation? Why is it important?

**Input Validation** is the process of checking user input to ensure it meets required criteria before processing.

### Why It's Important:

1. **Security**: Prevents injection attacks (SQL, XSS, NoSQL injection)
2. **Data Integrity**: Ensures data conforms to expected format
3. **User Experience**: Provides immediate feedback on invalid input
4. **Database Protection**: Prevents invalid data from being stored
5. **Business Logic**: Enforces business rules (age limits, password strength)

### Validation Types:

**1. Type Validation**: Check data type
```javascript
if (typeof age !== 'number') {
    throw new ValidationError('Age must be a number')
}
```

**2. Format Validation**: Check format (email, phone, etc.)
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format')
}
```

**3. Range Validation**: Check value ranges
```javascript
if (age < 18 || age > 120) {
    throw new ValidationError('Age must be between 18 and 120')
}
```

**4. Required Field Validation**: Check presence
```javascript
if (!email) {
    throw new ValidationError('Email is required')
}
```

**5. Length Validation**: Check string length
```javascript
if (password.length < 8) {
    throw new ValidationError('Password must be at least 8 characters')
}
```

### Best Practices:
- Validate on server-side (client-side can be bypassed)
- Validate early (before processing)
- Return clear, specific error messages
- Sanitize input (remove harmful characters)
- Use validation libraries for complex rules

---

## 8. What libraries can you use for validation (Joi, express-validator, etc.)?

Popular validation libraries for Node.js/Express:

### 1. **Joi**
Schema-based validation library.

```javascript
const Joi = require('joi')

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(/[A-Z]/).required(),
    age: Joi.number().integer().min(18).max(120).required()
})

const { error, value } = schema.validate(req.body)
```

**Pros**: Powerful, expressive, schema-based
**Cons**: Larger bundle size, learning curve

### 2. **express-validator**
Express middleware for validation.

```javascript
const { body, validationResult } = require('express-validator')

router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    body('age').isInt({ min: 18, max: 120 })
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
})
```

**Pros**: Express-specific, chainable validators, built-in sanitization
**Cons**: Verbose syntax

### 3. **Yup**
Schema validation similar to Joi, lighter weight.

```javascript
const yup = require('yup')

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8).required()
})

await schema.validate(req.body)
```

**Pros**: Lightweight, TypeScript-friendly
**Cons**: Less features than Joi

### 4. **Validator.js**
Simple validation functions.

```javascript
const validator = require('validator')

if (!validator.isEmail(email)) {
    throw new Error('Invalid email')
}
```

**Pros**: Simple, focused functions
**Cons**: Not schema-based, manual validation

### 5. **Custom Validation**
Build your own validation logic (as in this project).

**Pros**: Full control, no dependencies
**Cons**: More code to maintain

### Choosing a Library:
- **Simple Projects**: Custom validation or validator.js
- **Express Apps**: express-validator
- **Complex Schemas**: Joi or Yup
- **TypeScript**: Yup (better TS support)

---

## 9. How do you sanitize user input?

**Input Sanitization** cleans user input to remove potentially harmful content and format it consistently.

### Sanitization Techniques:

**1. Trim Whitespace:**
```javascript
email = email.trim()
name = name.trim()
```

**2. Remove HTML Tags:**
```javascript
const cleanInput = input.replace(/<[^>]*>/g, '')
```

**3. Escape Special Characters:**
```javascript
const escaped = input.replace(/[&<>"']/g, (char) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }
    return map[char]
})
```

**4. Normalize Format:**
```javascript
// Email to lowercase
email = email.toLowerCase()

// Remove extra spaces
text = text.replace(/\s+/g, ' ')
```

**5. Remove Dangerous Characters:**
```javascript
// Remove SQL injection patterns
input = input.replace(/['";\\]/g, '')

// Remove script tags
input = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
```

### Using express-validator (Built-in Sanitization):

```javascript
const { body, sanitizeBody } = require('express-validator')

router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('name').trim().escape(),
    sanitizeBody('email').toLowerCase()
], handler)
```

### Custom Sanitization Middleware:

```javascript
const sanitizeInput = (req, res, next) => {
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim()
                
                // Remove HTML tags
                req.body[key] = req.body[key].replace(/<[^>]*>/g, '')
            }
        })
        
        // Normalize email
        if (req.body.email) {
            req.body.email = req.body.email.toLowerCase().trim()
        }
    }
    next()
}
```

### Best Practices:
- **Always sanitize** before validation
- **Trim whitespace** from strings
- **Normalize formats** (lowercase emails)
- **Remove HTML** if not needed
- **Escape special characters** for output (XSS prevention)
- **Whitelist approach**: Only allow safe characters

---

## 10. What is the difference between client-side and server-side validation?

### Client-Side Validation:
Validation performed in the browser (JavaScript) before sending data to server.

**Characteristics:**
- Immediate feedback (no server round-trip)
- Better user experience
- Can be bypassed (disabled JavaScript, dev tools)
- Faster response time
- Reduces server load

**Example:**
```javascript
// HTML5 validation
<input type="email" required minlength="8" />

// JavaScript validation
if (!email.includes('@')) {
    alert('Invalid email')
    return false
}
```

**Use For:**
- Format checks (email format)
- Required field checks
- Length validation
- Real-time feedback
- Better UX

### Server-Side Validation:
Validation performed on the server before processing data.

**Characteristics:**
- **Cannot be bypassed** (critical for security)
- **Reliable**: Always executes
- **Security**: Prevents malicious input
- **Database protection**: Ensures data integrity
- **Business logic**: Enforces complex rules

**Example:**
```javascript
// Server-side validation
if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' })
}
```

**Use For:**
- **All validations** (as primary validation)
- Security checks
- Business logic rules
- Database constraints
- Authentication/authorization

### Comparison:

| Aspect | Client-Side | Server-Side |
|--------|-------------|-------------|
| **Security** | Can be bypassed ❌ | Cannot be bypassed ✅ |
| **Speed** | Instant ✅ | Network delay ⚠️ |
| **User Experience** | Immediate feedback ✅ | Requires request ⚠️ |
| **Reliability** | Can be disabled ❌ | Always executes ✅ |
| **Purpose** | UX enhancement | Security & integrity |

### Best Practice:
**Use both:**
- **Client-side**: For better UX (immediate feedback)
- **Server-side**: For security (always validate, never trust client)

**Never rely only on client-side validation** - it can always be bypassed!

### Implementation Strategy:
1. Client-side validation for immediate feedback
2. **Always validate on server** as primary validation
3. Server validation is the source of truth
4. Client validation improves UX, not security

---

## License

ISC
