# File Processing with Streams - Day 5 NodeJS Submission

A Node.js API that processes large CSV files using streams, converts each line to uppercase, and tracks progress in real-time.

---

## 📋 Features

✅ **Stream-based processing** - Handles large files efficiently  
✅ **Progress tracking** - Real-time percentage completion  
✅ **Error handling** - Comprehensive error management  
✅ **Asynchronous processing** - Non-blocking file operations  
✅ **Status API** - Check processing status via job ID  
✅ **Memory efficient** - Uses streams instead of loading entire file

---

## 🚀 Quick Start

### 1. Installation

```bash
cd "Day5/NodeJS Submission"
npm install
```

### 2. Create Sample CSV File

Create a file `uploads/sample.csv`:

```csv
name,email,city
John Doe,john@example.com,New York
Jane Smith,jane@example.com,Los Angeles
Bob Wilson,bob@example.com,Chicago
Alice Brown,alice@example.com,Houston
```

### 3. Start Server

```bash
npm start
```

Server runs on `http://localhost:3000`

---

## 📡 API Endpoints

### 1. Test Endpoint

```http
GET /test
```

**Response:**

```json
{
  "message": "File Processing API is running"
}
```

---

### 2. Process CSV File

```http
POST /process-file
Content-Type: application/json

{
  "filename": "sample.csv"
}
```

**Response (202 Accepted):**

```json
{
  "message": "File processing started",
  "jobId": "job_1234567890_abc123",
  "statusUrl": "/status/job_1234567890_abc123"
}
```

**Error Responses:**

**400 Bad Request:**

```json
{
  "error": "Filename is required",
  "message": "Please provide filename in request body: { \"filename\": \"input.csv\" }"
}
```

**404 Not Found:**

```json
{
  "error": "File not found",
  "message": "File sample.csv not found in uploads directory",
  "hint": "Place your CSV file in the uploads directory"
}
```

---

### 3. Get Processing Status

```http
GET /status/:jobId
```

**Example:**

```http
GET /status/job_1234567890_abc123
```

**Response (Processing):**

```json
{
  "jobId": "job_1234567890_abc123",
  "status": "processing",
  "progress": 45,
  "message": "Processing... 45% complete",
  "linesProcessed": 450,
  "bytesProcessed": 45000,
  "totalBytes": 100000,
  "inputFile": "sample.csv",
  "outputFile": "processed_sample.csv",
  "startTime": "2024-01-15T10:30:00.000Z"
}
```

**Response (Completed):**

```json
{
  "jobId": "job_1234567890_abc123",
  "status": "completed",
  "progress": 100,
  "message": "Processing completed successfully",
  "linesProcessed": 1000,
  "endTime": "2024-01-15T10:30:15.000Z",
  "outputPath": "/path/to/output/processed_sample.csv"
}
```

**Response (Error):**

```json
{
  "jobId": "job_1234567890_abc123",
  "status": "error",
  "progress": 0,
  "message": "Error: File read error",
  "error": "File read error"
}
```

---

## 🧪 Testing with cURL

### 1. Test Server

```bash
curl http://localhost:3000/test
```

### 2. Process File

```bash
curl -X POST http://localhost:3000/process-file \
  -H "Content-Type: application/json" \
  -d '{"filename": "sample.csv"}'
```

### 3. Check Status

```bash
# Replace JOB_ID with the jobId from step 2
curl http://localhost:3000/status/JOB_ID
```

### 4. Monitor Progress

```bash
# Poll status every 2 seconds
watch -n 2 'curl -s http://localhost:3000/status/JOB_ID | jq .'
```

---

## 📊 How It Works

### Stream Processing Flow

```
┌─────────────────────────────────────────────────────────┐
│              Stream Processing Pipeline                  │
└─────────────────────────────────────────────────────────┘

Input CSV File
      │
      ▼
Read Stream (64KB chunks)
      │
      ▼
Transform Stream (Uppercase conversion)
      │
      ├─── Progress Tracking ───┐
      │                          │
      │                          ▼
      │                    Update Status
      │                    (Every 5% progress)
      │                          │
      ▼                          │
Write Stream                    │
      │                          │
      ▼                          │
Output CSV File                 │
      │                          │
      └──────────────────────────┘
```

### Key Components

1. **Read Stream**: Reads file in chunks (64KB)
2. **Transform Stream**: Converts each line to uppercase
3. **Write Stream**: Writes processed data to output file
4. **Progress Tracking**: Calculates percentage based on bytes processed
5. **Status Updates**: Saves progress to JSON file

---

## 🔧 Implementation Details

### Stream Types Used

- **Readable Stream**: `fs.createReadStream()` - Reads input file
- **Transform Stream**: Custom `Transform` class - Processes data
- **Writable Stream**: `fs.createWriteStream()` - Writes output file

### Progress Calculation

```javascript
const progress = Math.round((processedBytes / fileSize) * 100);
```

### Error Handling

- File not found errors
- Stream read/write errors
- Invalid input validation
- Status file write errors

---

## 📁 Directory Structure

```
Day5/NodeJS Submission/
├── server.js                 # Express server
├── controllers/
│   └── file.controller.js   # File processing logic
├── uploads/                  # Input CSV files
├── output/                   # Processed CSV files
├── status/                   # Processing status files
├── package.json
└── README.md
```

---

## 🎯 Use Cases

- **Large CSV Processing**: Handle files too large for memory
- **Data Transformation**: Convert, filter, or modify CSV data
- **Real-time Progress**: Track processing status
- **Background Jobs**: Asynchronous file processing
- **Memory Efficiency**: Process files without loading into memory

---

## ⚠️ Important Notes

1. **File Location**: Place input CSV files in `uploads/` directory
2. **Output Location**: Processed files saved in `output/` directory
3. **Status Files**: Temporary status files in `status/` directory
4. **Large Files**: Streams handle large files efficiently
5. **Concurrent Processing**: Multiple files can be processed simultaneously

---

## 🔍 Example Workflow

1. **Place CSV file** in `uploads/sample.csv`
2. **Start processing**: `POST /process-file` with filename
3. **Get job ID** from response
4. **Poll status**: `GET /status/{jobId}` to track progress
5. **Get result**: Processed file in `output/processed_sample.csv`

---

## 📚 Theoretical Questions & Answers

### 1. What is Node.js? How does it differ from browser JavaScript?

**Node.js** is a JavaScript runtime built on Chrome's V8 engine that allows JavaScript to run on the server-side.

**Key Differences:**

| Browser JavaScript          | Node.js                             |
| --------------------------- | ----------------------------------- |
| Runs in browser             | Runs on server                      |
| Has DOM, window objects     | Has `process`, `fs`, `http` modules |
| Limited file system access  | Full file system access             |
| Single-threaded UI blocking | Non-blocking I/O operations         |
| Uses `fetch()` for HTTP     | Uses `http`/`https` modules         |

**Example:**

```javascript
// Browser: Can't access file system
// Node.js: Can read/write files
const fs = require("fs");
fs.readFile("data.txt", "utf8", (err, data) => {
  console.log(data);
});
```

---

### 2. What is the event loop in Node.js? Explain how it works.

The **event loop** is Node.js's mechanism for handling asynchronous operations. It continuously checks for completed tasks and executes callbacks.

**How it works:**

```
┌─────────────────────────────────────┐
│         Event Loop Phases            │
└─────────────────────────────────────┘

1. Timers Phase
   - Execute setTimeout/setInterval callbacks

2. Pending Callbacks
   - Execute I/O callbacks deferred to next loop

3. Idle/Prepare
   - Internal use only

4. Poll Phase
   - Fetch new I/O events
   - Execute I/O callbacks

5. Check Phase
   - Execute setImmediate() callbacks

6. Close Callbacks
   - Execute close event callbacks (e.g., socket.on('close'))
```

**Example:**

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);
setImmediate(() => console.log("3"));
process.nextTick(() => console.log("4"));

console.log("5");

// Output: 1, 5, 4, 2, 3
// nextTick runs before event loop phases
```

---

### 3. What is non-blocking I/O? How does Node.js achieve it?

**Non-blocking I/O** means operations don't wait for completion before moving to the next task. Node.js continues executing other code while I/O operations run in the background.

**How Node.js achieves it:**

1. **Libuv Library**: Handles asynchronous I/O operations
2. **Event Loop**: Manages callback execution
3. **Thread Pool**: Uses worker threads for file system operations
4. **Callbacks/Promises**: Notify when operations complete

**Example:**

```javascript
// Blocking (synchronous)
const data = fs.readFileSync("file.txt"); // Waits here
console.log("Done");

// Non-blocking (asynchronous)
fs.readFile("file.txt", (err, data) => {
  console.log("File read");
});
console.log("This runs immediately"); // Runs before file is read
```

---

### 4. Explain the difference between synchronous and asynchronous code.

**Synchronous Code:**

- Executes line by line, waiting for each operation to complete
- Blocks execution until operation finishes
- Simple but can freeze the application

**Asynchronous Code:**

- Starts operations and continues execution
- Uses callbacks/promises to handle completion
- Non-blocking, better for I/O operations

**Example:**

```javascript
// Synchronous
console.log("1");
const data = fs.readFileSync("file.txt"); // Blocks here
console.log("2"); // Waits for file read

// Asynchronous
console.log("1");
fs.readFile("file.txt", () => {
  console.log("2"); // Runs after file read
});
console.log("3"); // Runs immediately, doesn't wait
```

---

### 5. What are callbacks? What is callback hell?

**Callbacks** are functions passed as arguments to be executed after an operation completes.

**Callback Hell** (Pyramid of Doom) occurs when callbacks are nested deeply, making code hard to read and maintain.

**Example:**

```javascript
// Callback
fs.readFile("file1.txt", (err, data1) => {
  fs.readFile("file2.txt", (err, data2) => {
    fs.readFile("file3.txt", (err, data3) => {
      // Nested callbacks - callback hell!
      console.log(data1, data2, data3);
    });
  });
});
```

**Solutions:** Promises, async/await

---

### 6. What are Promises? How do they solve callback hell?

**Promises** are objects representing the eventual completion (or failure) of an asynchronous operation.

**They solve callback hell by:**

- Chaining with `.then()` instead of nesting
- Better error handling with `.catch()`
- Cleaner, more readable code

**Example:**

```javascript
// Callback hell
fs.readFile("file1.txt", (err, data1) => {
  fs.readFile("file2.txt", (err, data2) => {
    // Nested...
  });
});

// Promises
fs.promises
  .readFile("file1.txt")
  .then((data1) => fs.promises.readFile("file2.txt"))
  .then((data2) => fs.promises.readFile("file3.txt"))
  .then((data3) => console.log(data1, data2, data3))
  .catch((err) => console.error(err));
```

---

### 7. What is async/await? How does it work internally?

**async/await** is syntactic sugar over Promises that makes asynchronous code look synchronous.

**How it works:**

- `async` functions return Promises
- `await` pauses execution until Promise resolves
- Internally uses generators and Promises

**Example:**

```javascript
// Promises
fetch("/api/data")
  .then((res) => res.json())
  .then((data) => console.log(data));

// async/await
async function getData() {
  const res = await fetch("/api/data");
  const data = await res.json();
  console.log(data);
}
```

**Internal mechanism:**

- Transforms `async/await` into Promise chains
- Uses generator functions to pause/resume execution

---

### 8. What is the difference between process.nextTick() and setImmediate()?

| process.nextTick()                | setImmediate()          |
| --------------------------------- | ----------------------- |
| Executes before event loop phases | Executes in Check phase |
| Higher priority                   | Lower priority          |
| Can starve event loop             | Fair scheduling         |
| Microtask queue                   | Macrotask queue         |

**Example:**

```javascript
setImmediate(() => console.log("setImmediate"));
process.nextTick(() => console.log("nextTick"));
console.log("sync");

// Output: sync, nextTick, setImmediate
// nextTick runs before setImmediate
```

**Use cases:**

- `nextTick`: Ensure callback runs before event loop continues
- `setImmediate`: Execute after current phase completes

---

### 9. What are streams in Node.js? Name the types of streams.

**Streams** are objects that handle data in chunks instead of loading everything into memory.

**Types of Streams:**

1. **Readable**: Read data (e.g., `fs.createReadStream()`)
2. **Writable**: Write data (e.g., `fs.createWriteStream()`)
3. **Duplex**: Both read and write (e.g., `net.Socket`)
4. **Transform**: Modify data while reading/writing (e.g., `zlib.createGzip()`)

**Example:**

```javascript
const readStream = fs.createReadStream("input.txt");
const writeStream = fs.createWriteStream("output.txt");

readStream.pipe(writeStream); // Pipe readable to writable
```

**Benefits:**

- Memory efficient for large files
- Can process data as it arrives
- Composable with `.pipe()`

---

### 10. What is the Buffer class in Node.js?

**Buffer** is a global class in Node.js for handling binary data (raw memory allocation).

**Key Points:**

- Represents fixed-size chunk of memory
- Used for binary data (images, files, network data)
- Similar to arrays but for binary data
- Created when data is not in JavaScript string format

**Example:**

```javascript
// Create buffer
const buf = Buffer.from("Hello", "utf8");
console.log(buf); // <Buffer 48 65 6c 6c 6f>

// Convert to string
console.log(buf.toString("utf8")); // Hello

// Buffer operations
const buf1 = Buffer.from("Hello");
const buf2 = Buffer.from(" World");
const combined = Buffer.concat([buf1, buf2]);
console.log(combined.toString()); // Hello World
```

**Use cases:**

- File I/O operations
- Network data transfer
- Image processing
- Cryptography operations

---

## 📚 Summary

**Implementation Complete! ✅**

- ✅ Stream-based CSV processing
- ✅ Progress tracking with percentage
- ✅ Error handling
- ✅ Status API endpoint
- ✅ Memory-efficient file handling
- ✅ Asynchronous processing

**Key Concepts Demonstrated:**

1. Node.js Streams (Readable, Writable, Transform)
2. Event Loop and Asynchronous I/O
3. Error Handling
4. Progress Tracking
5. File System Operations
6. Express.js API Development

---

## 🎓 Key Takeaways

- **Streams** are essential for handling large files efficiently
- **Non-blocking I/O** allows Node.js to handle many concurrent operations
- **Progress tracking** improves user experience for long-running tasks
- **Error handling** is crucial for production applications
- **Async/await** makes asynchronous code more readable

---

**Happy Coding! 🚀**
