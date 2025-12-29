# Event-Driven File Watcher - Day 6 NodeJS Submission

A Node.js file watcher using `fs.watch()` and `EventEmitter` that monitors directory changes and emits custom events for file additions, modifications, and deletions.

---

## 📋 Features

✅ **File watching** - Monitors directory for changes using `fs.watch()`  
✅ **Event-driven** - Uses EventEmitter for custom events  
✅ **Multiple event types** - Detects file added, modified, deleted  
✅ **Timestamps** - All events include ISO timestamps  
✅ **Error handling** - Comprehensive error management  
✅ **Recursive watching** - Monitors subdirectories  
✅ **Directory detection** - Distinguishes files from directories

---

## 🚀 Quick Start

### 1. Installation

```bash
cd "Day6/NodeJS Submission"
npm install
```

### 2. Start File Watcher

```bash
npm start
```

The watcher will start monitoring the `watch/` directory.

### 3. Test the Watcher

In another terminal, try these operations:

```bash
# Create a file
echo "Hello World" > watch/test.txt

# Modify the file
echo "Updated content" >> watch/test.txt

# Delete the file
rm watch/test.txt
```

You'll see events logged in the watcher terminal!

---

## 📡 Events Emitted

### 1. `added` Event

Emitted when a new file is detected in the watched directory.

**Event Data:**

```javascript
{
  filename: 'test.txt',
  filePath: '/path/to/watch/test.txt',
  timestamp: '2024-01-15T10:30:00.000Z',
  eventType: 'rename' // or 'change'
}
```

---

### 2. `modified` Event

Emitted when an existing file is modified.

**Event Data:**

```javascript
{
  filename: 'test.txt',
  filePath: '/path/to/watch/test.txt',
  timestamp: '2024-01-15T10:30:15.000Z',
  eventType: 'change'
}
```

---

### 3. `deleted` Event

Emitted when a file is deleted from the watched directory.

**Event Data:**

```javascript
{
  filename: 'test.txt',
  filePath: '/path/to/watch/test.txt',
  timestamp: '2024-01-15T10:30:30.000Z',
  eventType: 'rename'
}
```

---

### 4. `directory` Event

Emitted when a directory change is detected.

**Event Data:**

```javascript
{
  filename: 'subfolder',
  filePath: '/path/to/watch/subfolder',
  timestamp: '2024-01-15T10:30:45.000Z',
  eventType: 'rename'
}
```

---

### 5. `error` Event

Emitted when an error occurs.

**Event Data:**

```javascript
Error {
  message: 'Error message',
  stack: 'Error stack trace'
}
```

---

### 6. `started` Event

Emitted when the watcher starts.

**Event Data:**

```javascript
"Watching directory: /path/to/watch";
```

---

### 7. `stopped` Event

Emitted when the watcher stops.

**Event Data:**

```javascript
"File watcher stopped";
```

---

## 🔧 Usage

### Basic Usage

```javascript
const FileWatcher = require("./watcher");
const path = require("path");

// Create watcher instance
const watcher = new FileWatcher("./watch");

// Listen for file added
watcher.on("added", (data) => {
  console.log(`File added: ${data.filename} at ${data.timestamp}`);
});

// Listen for file modified
watcher.on("modified", (data) => {
  console.log(`File modified: ${data.filename} at ${data.timestamp}`);
});

// Listen for file deleted
watcher.on("deleted", (data) => {
  console.log(`File deleted: ${data.filename} at ${data.timestamp}`);
});

// Listen for errors
watcher.on("error", (error) => {
  console.error("Watcher error:", error.message);
});

// Start watching
watcher.start();

// Stop watching (when done)
// watcher.stop();
```

---

### Advanced Usage

```javascript
const FileWatcher = require("./watcher");

const watcher = new FileWatcher("./watch");

// Use once() for one-time events
watcher.once("started", () => {
  console.log("Watcher started successfully");
});

// Multiple listeners for same event
watcher.on("added", (data) => {
  console.log("Listener 1: File added");
});

watcher.on("added", (data) => {
  console.log("Listener 2: File added");
});

// Remove listener
const handler = (data) => console.log("File added");
watcher.on("added", handler);
watcher.removeListener("added", handler);

watcher.start();
```

---

## 📊 How It Works

### Event Flow

```
┌─────────────────────────────────────────────────────┐
│           File Watcher Event Flow                   │
└─────────────────────────────────────────────────────┘

fs.watch() detects change
      │
      ▼
FileWatcher.handleFileEvent()
      │
      ├─── File doesn't exist ──→ emit('deleted')
      │
      ├─── File exists ──→ checkFileStatus()
      │                        │
      │                        ├─── First time ──→ emit('added')
      │                        │
      │                        └─── Seen before ──→ emit('modified')
      │
      └─── Directory ──→ emit('directory')
```

### Key Components

1. **fs.watch()**: Native Node.js file system watcher
2. **EventEmitter**: Base class for emitting custom events
3. **File Cache**: Tracks seen files to distinguish add vs modify
4. **Error Handling**: Catches and emits errors appropriately

---

## 🧪 Testing

### Test File Operations

1. **Create a file:**

   ```bash
   echo "test" > watch/test.txt
   ```

   Expected: `added` event

2. **Modify the file:**

   ```bash
   echo "updated" >> watch/test.txt
   ```

   Expected: `modified` event

3. **Delete the file:**

   ```bash
   rm watch/test.txt
   ```

   Expected: `deleted` event

4. **Create a directory:**
   ```bash
   mkdir watch/subfolder
   ```
   Expected: `directory` event

---

## ⚠️ Important Notes

1. **File Detection**: The watcher uses a cache to distinguish between file additions and modifications. Files are tracked on first detection.

2. **Event Types**: `fs.watch()` emits `'rename'` for both file creation and deletion. The watcher uses `fs.stat()` to determine the actual operation.

3. **Recursive Watching**: The watcher monitors subdirectories recursively.

4. **Platform Differences**: `fs.watch()` behavior may vary slightly across platforms (Windows, macOS, Linux).

5. **Performance**: For large directories, consider using `chokidar` or `node-watch` for better performance.

---

## 📁 Directory Structure

```
Day6/NodeJS Submission/
├── server.js              # Main entry point
├── watcher.js             # FileWatcher class
├── watch/                 # Directory being watched
├── package.json
└── README.md
```

---

## 🎯 Use Cases

- **Development Tools**: Auto-reload on file changes
- **Build Systems**: Trigger builds on source file changes
- **Backup Systems**: Monitor files for backup triggers
- **Log Monitoring**: Watch log files for new entries
- **File Synchronization**: Sync files across systems

---

## 📚 Theoretical Questions & Answers

### 1. What are core modules in Node.js? Name at least 10.

**Core modules** are built-in Node.js modules that don't require installation via npm.

**10+ Core Modules:**

1. **fs** - File system operations
2. **path** - Path manipulation utilities
3. **http** - HTTP server and client
4. **https** - HTTPS server and client
5. **events** - Event emitter functionality
6. **stream** - Stream interface
7. **util** - Utility functions
8. **os** - Operating system utilities
9. **crypto** - Cryptographic functionality
10. **url** - URL parsing and formatting
11. **querystring** - Query string parsing
12. **buffer** - Binary data handling
13. **cluster** - Cluster management
14. **child_process** - Child process creation
15. **net** - Network functionality
16. **dns** - DNS lookups
17. **zlib** - Compression/decompression

**Example:**

```javascript
const fs = require("fs"); // Core module
const express = require("express"); // npm package (not core)
```

---

### 2. Explain the 'fs' module. What's the difference between fs and fs/promises?

The **fs module** provides file system operations (read, write, delete files/directories).

**fs (Callback-based):**

- Uses callbacks for asynchronous operations
- Traditional Node.js style
- Example: `fs.readFile(path, callback)`

**fs/promises (Promise-based):**

- Returns Promises instead of using callbacks
- Can use async/await
- Example: `fs.promises.readFile(path)`

**Example:**

```javascript
// fs (callback)
const fs = require("fs");
fs.readFile("file.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// fs/promises
const fs = require("fs").promises;
async function readFile() {
  try {
    const data = await fs.readFile("file.txt", "utf8");
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

---

### 3. What is the 'path' module used for?

The **path module** provides utilities for working with file and directory paths.

**Key Functions:**

- `path.join()` - Join path segments
- `path.resolve()` - Resolve absolute path
- `path.dirname()` - Get directory name
- `path.basename()` - Get filename
- `path.extname()` - Get file extension
- `path.parse()` - Parse path into components

**Example:**

```javascript
const path = require("path");

path.join("/users", "john", "file.txt");
// '/users/john/file.txt'

path.basename("/users/john/file.txt");
// 'file.txt'

path.extname("file.txt");
// '.txt'

path.parse("/users/john/file.txt");
// { root: '/', dir: '/users/john', base: 'file.txt', ext: '.txt', name: 'file' }
```

**Why use it?**

- Cross-platform path handling (Windows vs Unix)
- Avoids manual string concatenation
- Handles edge cases automatically

---

### 4. Explain the EventEmitter class. How do you use it?

**EventEmitter** is a class that enables event-driven programming. Objects can emit events and listeners can respond to them.

**How to use:**

1. **Extend EventEmitter:**

```javascript
const { EventEmitter } = require("events");

class MyEmitter extends EventEmitter {}

const emitter = new MyEmitter();
```

2. **Emit events:**

```javascript
emitter.emit("event", "data");
```

3. **Listen to events:**

```javascript
emitter.on("event", (data) => {
  console.log("Event received:", data);
});
```

**Example:**

```javascript
const { EventEmitter } = require("events");

class Logger extends EventEmitter {
  log(message) {
    this.emit("log", message);
  }
}

const logger = new Logger();

logger.on("log", (message) => {
  console.log("Logged:", message);
});

logger.log("Hello"); // Triggers 'log' event
```

---

### 5. What is the difference between on() and once() in EventEmitter?

**on()** - Registers a listener that will be called every time the event is emitted.

**once()** - Registers a listener that will be called only once, then automatically removed.

**Example:**

```javascript
const { EventEmitter } = require("events");
const emitter = new EventEmitter();

// on() - called every time
emitter.on("event", () => console.log("on: called"));
emitter.emit("event"); // 'on: called'
emitter.emit("event"); // 'on: called' (called again)

// once() - called only once
emitter.once("event", () => console.log("once: called"));
emitter.emit("event"); // 'once: called'
emitter.emit("event"); // (not called again)
```

**Use cases:**

- `on()`: Ongoing event handling (file watchers, server requests)
- `once()`: One-time setup (initialization, connection established)

---

### 6. How does error handling work with EventEmitters?

**Error Events** are special in EventEmitter. If an error event is emitted and no listener is registered, Node.js will throw an uncaught exception and crash.

**Best Practices:**

1. **Always listen for 'error' events:**

```javascript
emitter.on("error", (error) => {
  console.error("Error occurred:", error);
});
```

2. **Emit errors properly:**

```javascript
emitter.emit("error", new Error("Something went wrong"));
```

3. **Handle errors in async operations:**

```javascript
const fs = require("fs");
const { EventEmitter } = require("events");

class FileReader extends EventEmitter {
  readFile(path) {
    fs.readFile(path, (err, data) => {
      if (err) {
        this.emit("error", err); // Emit error event
        return;
      }
      this.emit("data", data);
    });
  }
}

const reader = new FileReader();
reader.on("error", (err) => {
  console.error("File read error:", err.message);
});
reader.readFile("nonexistent.txt");
```

**Without error listener:**

```javascript
// This will crash the process!
emitter.emit("error", new Error("No listener"));
```

---

### 7. What is the 'cluster' module? Why would you use it?

The **cluster module** allows you to create child processes that share server ports, enabling multi-core utilization.

**Why use it:**

- **Utilize multiple CPU cores** - Node.js is single-threaded
- **Improve performance** - Handle more concurrent requests
- **Fault tolerance** - If one worker crashes, others continue

**Example:**

```javascript
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  // Master process - fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Worker process - handle requests
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("Hello from worker " + cluster.worker.id);
    })
    .listen(3000);
}
```

**Benefits:**

- Scales across CPU cores
- Better performance for CPU-intensive tasks
- Improved reliability

---

### 8. What are child processes? When would you spawn one?

**Child processes** are separate Node.js processes created from the main process.

**When to spawn:**

- **CPU-intensive tasks** - Offload heavy computation
- **External commands** - Run shell commands
- **Isolation** - Separate process for security
- **Parallel processing** - Run multiple tasks simultaneously

**Example:**

```javascript
const { spawn } = require("child_process");

// Spawn a child process
const ls = spawn("ls", ["-la"]);

ls.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

ls.on("close", (code) => {
  console.log(`Process exited with code ${code}`);
});
```

**Use cases:**

- Running shell scripts
- Processing large files
- Image/video processing
- Running external tools

---

### 9. What is the difference between spawn, exec, and fork?

| Method    | Description                               | Use Case                             |
| --------- | ----------------------------------------- | ------------------------------------ |
| **spawn** | Spawns a new process, returns stream      | Long-running processes, large output |
| **exec**  | Executes command in shell, returns buffer | Short commands, small output         |
| **fork**  | Special spawn for Node.js scripts         | Node.js scripts, IPC communication   |

**spawn:**

```javascript
const { spawn } = require("child_process");
const ls = spawn("ls", ["-la"]); // Streams output
ls.stdout.on("data", (data) => console.log(data));
```

**exec:**

```javascript
const { exec } = require("child_process");
exec("ls -la", (error, stdout, stderr) => {
  console.log(stdout); // Buffer with all output
});
```

**fork:**

```javascript
const { fork } = require("child_process");
const child = fork("script.js"); // Node.js script
child.on("message", (msg) => console.log(msg));
```

**Key Differences:**

- **spawn**: Streams, no shell, better for large output
- **exec**: Buffers, uses shell, simpler for small commands
- **fork**: Node.js only, enables IPC (Inter-Process Communication)

---

## 📚 Summary

**Implementation Complete! ✅**

- ✅ File watcher using `fs.watch()`
- ✅ EventEmitter for custom events
- ✅ File added, modified, deleted detection
- ✅ Timestamps on all events
- ✅ Comprehensive error handling
- ✅ Recursive directory watching

**Key Concepts Demonstrated:**

1. EventEmitter class and event-driven programming
2. fs.watch() for file system monitoring
3. Error handling with EventEmitters
4. Custom event creation and emission
5. Event listener management

---

## 🎓 Key Takeaways

- **EventEmitter** enables event-driven architecture
- **fs.watch()** provides native file system monitoring
- **Error events** must have listeners to prevent crashes
- **on() vs once()** for different listener needs
- **Child processes** enable parallel processing and isolation

---

**Happy Coding! 🚀**
