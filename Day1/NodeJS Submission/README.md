# Task REST API Server

A simple REST API server built with Express.js for managing tasks with full CRUD operations. Uses in-memory storage (no database required).

## Features

- ✅ Create, Read, Update, Delete tasks
- ✅ Proper HTTP methods (GET, POST, PUT, PATCH, DELETE)
- ✅ Appropriate HTTP status codes
- ✅ Input validation
- ✅ RESTful API design

## Task Resource Structure

Each task has the following properties:
- `id` (number): Unique identifier (auto-generated)
- `title` (string, required): Task title
- `description` (string, optional): Task description
- `status` (string, optional): Task status - one of: `pending`, `in-progress`, `completed` (default: `pending`)
- `createdAt` (string): ISO timestamp of creation
- `updatedAt` (string): ISO timestamp of last update (only for PUT/PATCH)

## Installation

1. Navigate to the project directory:
```bash
cd "Day1/NodeJS Submission"
```

2. Install dependencies:
```bash
npm install
```

## Running the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:3000/api/tasks
```

### 1. Get All Tasks
**GET** `/api/tasks`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Complete assignment",
      "description": "Finish the Node.js project",
      "status": "in-progress",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 2. Get Single Task
**GET** `/api/tasks/:id`

**Example:** `GET /api/tasks/1`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Complete assignment",
    "description": "Finish the Node.js project",
    "status": "in-progress",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Task with ID 1 not found"
}
```

### 3. Create Task
**POST** `/api/tasks`

**Request Body:**
```json
{
  "title": "New Task",
  "description": "Task description",
  "status": "pending"
}
```

**Required Fields:**
- `title` (string, required)

**Optional Fields:**
- `description` (string)
- `status` (string: "pending" | "in-progress" | "completed")

**Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "title": "New Task",
    "description": "Task description",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Update Entire Task (PUT)
**PUT** `/api/tasks/:id`

**Example:** `PUT /api/tasks/1`

**Request Body:**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "status": "completed"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Task",
    "description": "Updated description",
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 5. Partially Update Task (PATCH)
**PATCH** `/api/tasks/:id`

**Example:** `PATCH /api/tasks/1`

**Request Body (only include fields to update):**
```json
{
  "status": "completed"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "title": "Existing Task",
    "description": "Existing description",
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### 6. Delete Task
**DELETE** `/api/tasks/:id`

**Example:** `DELETE /api/tasks/1`

**Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "id": 1,
    "title": "Deleted Task",
    "description": "Task description",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## HTTP Status Codes Used

- `200 OK` - Successful GET, PUT, PATCH, DELETE
- `201 Created` - Successful POST (resource created)
- `400 Bad Request` - Validation errors
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server errors

## Validation Rules

1. **Title**: Required, must be a non-empty string
2. **Description**: Optional, must be a string if provided
3. **Status**: Must be one of: `pending`, `in-progress`, `completed`

## Testing with cURL

### Create a task:
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Express", "description": "Build REST APIs", "status": "in-progress"}'
```

### Get all tasks:
```bash
curl http://localhost:3000/api/tasks
```

### Get single task:
```bash
curl http://localhost:3000/api/tasks/1
```

### Update task (PUT):
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Task", "description": "New description", "status": "completed"}'
```

### Partially update task (PATCH):
```bash
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

### Delete task:
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

## Testing with Postman

1. Import the collection or manually create requests
2. Set base URL: `http://localhost:3000/api/tasks`
3. For POST, PUT, PATCH: Set `Content-Type: application/json` in headers
4. Add request body in JSON format

## Notes

- Data is stored in-memory and will be lost when the server restarts
- Task IDs are auto-incremented starting from 1
- All timestamps are in ISO 8601 format

---

## Theoretical Questions - HTTP and REST APIs

### 1. What is HTTP and how does it work? Explain the request-response cycle.

**HTTP (HyperText Transfer Protocol)** is a protocol for transferring data between clients and servers over the internet.

**How it works:**
- Client sends an HTTP request to a server
- Server processes the request and sends back an HTTP response
- Communication is stateless (each request is independent)

**Request-Response Cycle:**
1. Client creates an HTTP request (method, URL, headers, body)
2. Request is sent over TCP/IP connection
3. Server receives and processes the request
4. Server generates an HTTP response (status code, headers, body)
5. Response is sent back to client
6. Client receives and processes the response
7. Connection may close or remain open (keep-alive)

---

### 2. What are the different HTTP methods (GET, POST, PUT, PATCH, DELETE) and when should each be used?

- **GET**: Retrieve data (read-only, no side effects). Example: Fetching a list of tasks
- **POST**: Create new resources. Example: Creating a new task
- **PUT**: Replace/update entire resource. Example: Updating all fields of a task
- **PATCH**: Partially update a resource. Example: Updating only the status field
- **DELETE**: Remove a resource. Example: Deleting a task

**Key differences:**
- PUT is idempotent (same request = same result)
- PATCH is for partial updates
- POST is for creation (not idempotent)

---

### 3. Explain HTTP status codes. What's the difference between 2xx, 3xx, 4xx, and 5xx?

**Status Code Categories:**

- **2xx (Success)**: Request was successful
  - `200 OK` - Standard success
  - `201 Created` - Resource created
  - `204 No Content` - Success with no response body

- **3xx (Redirection)**: Further action needed
  - `301 Moved Permanently`
  - `302 Found` (temporary redirect)
  - `304 Not Modified` (cached)

- **4xx (Client Error)**: Client made a mistake
  - `400 Bad Request` - Invalid request
  - `401 Unauthorized` - Authentication required
  - `403 Forbidden` - Access denied
  - `404 Not Found` - Resource doesn't exist
  - `422 Unprocessable Entity` - Validation error

- **5xx (Server Error)**: Server failed
  - `500 Internal Server Error` - Generic server error
  - `502 Bad Gateway` - Invalid response from upstream
  - `503 Service Unavailable` - Server overloaded

---

### 4. What are HTTP headers? Name some important request and response headers.

**HTTP Headers** are key-value pairs that provide metadata about requests/responses.

**Important Request Headers:**
- `Content-Type` - Type of data being sent (e.g., `application/json`)
- `Authorization` - Credentials for authentication
- `Accept` - What response format client expects
- `User-Agent` - Client application info
- `Cookie` - Stored cookies

**Important Response Headers:**
- `Content-Type` - Type of data in response
- `Set-Cookie` - Server setting cookies
- `Cache-Control` - Caching directives
- `Location` - Redirect URL (for 3xx responses)
- `Status` - HTTP status code

---

### 5. What is the difference between stateless and stateful protocols? Is HTTP stateless?

**Stateless Protocol:**
- Each request is independent
- Server doesn't remember previous requests
- No session state stored on server
- Example: HTTP

**Stateful Protocol:**
- Server maintains connection state
- Server remembers previous interactions
- Example: FTP, TCP

**HTTP is stateless** - each request contains all information needed. However, state can be maintained using:
- Cookies
- Sessions (server-side)
- Tokens (JWT)
- Query parameters

---

### 6. Explain idempotency in REST APIs. Which HTTP methods are idempotent?

**Idempotency** means making the same request multiple times produces the same result as making it once.

**Idempotent Methods:**
- **GET** - Always safe and idempotent
- **PUT** - Replacing entire resource (same data = same result)
- **DELETE** - Deleting same resource multiple times = same result
- **PATCH** - Can be idempotent if designed properly

**Non-idempotent:**
- **POST** - Creates new resources each time (different IDs)

**Why it matters:** Safe to retry idempotent requests if network fails.

---

### 7. What is REST? What are the principles of RESTful API design?

**REST (Representational State Transfer)** is an architectural style for designing web services.

**Principles:**
1. **Stateless** - Each request contains all needed information
2. **Client-Server** - Separation of concerns
3. **Uniform Interface** - Consistent way to interact (HTTP methods, status codes)
4. **Resource-Based** - URLs represent resources (nouns, not verbs)
5. **Representation** - Resources can have multiple formats (JSON, XML)
6. **Stateless Communication** - No server-side session storage

**RESTful Best Practices:**
- Use nouns in URLs: `/api/tasks` not `/api/getTasks`
- Use HTTP methods correctly
- Return appropriate status codes
- Use consistent response formats

---

### 8. How would you version a REST API? What are the different approaches?

**API Versioning Approaches:**

1. **URL Path Versioning** (Most Common)
   ```
   /api/v1/tasks
   /api/v2/tasks
   ```

2. **Query Parameter Versioning**
   ```
   /api/tasks?version=1
   /api/tasks?version=2
   ```

3. **Header Versioning**
   ```
   Accept: application/vnd.api.v1+json
   ```

4. **Subdomain Versioning**
   ```
   v1.api.example.com/tasks
   v2.api.example.com/tasks
   ```

**Best Practice:** URL path versioning is most explicit and widely used. Start with `/api/v1/` from the beginning.

**When to version:**
- Breaking changes to existing endpoints
- Changes to response structure
- Changes to required fields
- Deprecating features
