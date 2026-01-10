# Real-time File Upload Progress Tracker

A Node.js application that implements real-time file upload progress tracking using Socket.io. Users can upload files and receive live progress updates, speed metrics, and completion status through WebSocket connections.

## Features

- ✅ **Real-time Progress Tracking**: Live upload percentage updates via Socket.io
- ✅ **Multiple Simultaneous Uploads**: Support for uploading multiple files concurrently
- ✅ **Upload Cancellation**: Cancel ongoing uploads
- ✅ **Error Handling**: Comprehensive error handling for upload failures
- ✅ **Speed & Duration Metrics**: Real-time upload speed and time tracking
- ✅ **Drag & Drop Support**: User-friendly drag and drop file upload interface
- ✅ **Beautiful UI**: Modern, responsive web interface

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file (optional):

```env
PORT=3000
NODE_ENV=development
```

## Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

## Usage

1. Open `http://localhost:3000` in your browser
2. Connect to the Socket.io server (connection status shown at top)
3. Select files or drag and drop them
4. Watch real-time progress updates for each upload
5. Multiple files can be uploaded simultaneously

## API Endpoints

### Upload File
```
POST /api/upload
Content-Type: multipart/form-data
Headers:
  X-Socket-Id: <socket-id>
  X-Upload-Id: <upload-id>

Body: file (multipart file)
```

### Get Upload Status
```
GET /api/upload/:uploadId/status
```

### Get Active Uploads
```
GET /api/uploads/active
```

## Socket.io Events

### Client → Server
- `cancel-upload`: Cancel an ongoing upload

### Server → Client
- `upload-progress`: Real-time progress updates
- `upload-complete`: Upload completion notification
- `upload-error`: Upload error notification
- `upload-cancelled`: Upload cancellation confirmation

## Project Structure

```
Day14/NodeJS Submission/
├── server.js              # Express + Socket.io server
├── public/
│   └── index.html         # Client-side UI
├── uploads/               # Uploaded files directory
├── package.json
└── README.md
```

---

# Theoretical Questions

## 1. What is the difference between HTTP and WebSocket?

**HTTP** is a request-response protocol where:
- Client sends request → Server responds → Connection closes
- Stateless, one-way communication
- Client must initiate every interaction
- Higher overhead (headers with each request)

**WebSocket** is a full-duplex communication protocol where:
- Persistent connection between client and server
- Both can send messages at any time
- Lower overhead (no repeated headers)
- Real-time bidirectional communication

**Example:**
- HTTP: Like sending letters (request → wait → response)
- WebSocket: Like a phone call (continuous conversation)

---

## 2. When would you use WebSockets over HTTP?

Use WebSockets when you need:

1. **Real-time Updates**: Chat apps, live notifications, stock prices
2. **Bidirectional Communication**: Gaming, collaborative editing
3. **Low Latency**: When HTTP polling overhead is too high
4. **Persistent Connection**: When frequent communication is needed
5. **Live Data Streaming**: Progress tracking, live feeds

**Use HTTP when:**
- Simple request-response is sufficient
- Stateless operations (REST APIs)
- One-time data fetching
- When WebSocket overhead isn't justified

---

## 3. How does WebSocket connection work? Explain the handshake.

**WebSocket Handshake Process:**

1. **Client Request**: Client sends HTTP upgrade request
   ```
   GET /chat HTTP/1.1
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
   Sec-WebSocket-Version: 13
   ```

2. **Server Response**: Server accepts upgrade
   ```
   HTTP/1.1 101 Switching Protocols
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
   ```

3. **Connection Established**: HTTP connection upgrades to WebSocket
4. **Data Exchange**: Both sides can send messages using WebSocket protocol frames

**Key Points:**
- Starts as HTTP request (port 80/443)
- Server responds with `101 Switching Protocols`
- Connection persists after handshake
- Uses frames (not HTTP) for data transfer

---

## 4. What is Socket.io? How does it differ from native WebSockets?

**Socket.io** is a JavaScript library that provides:
- WebSocket abstraction with fallbacks
- Automatic reconnection
- Room/namespace management
- Built-in event system
- Cross-browser compatibility

**Differences:**

| Feature | Native WebSocket | Socket.io |
|---------|------------------|-----------|
| **Fallback** | None (fails if unsupported) | Long polling, etc. |
| **Reconnection** | Manual implementation | Automatic |
| **Events** | Manual message parsing | Built-in event system |
| **Rooms** | Not supported | Built-in support |
| **Broadcasting** | Manual implementation | Built-in methods |
| **Size** | Lightweight | Larger library |

**When to use:**
- **Socket.io**: Production apps needing reliability, fallbacks, features
- **Native WebSocket**: Simple use cases, minimal dependencies

---

## 5. What are rooms and namespaces in Socket.io?

**Rooms:**
- Virtual channels within a namespace
- Sockets can join/leave rooms
- Used for broadcasting to specific groups
- Example: Chat rooms, game lobbies

```javascript
// Join a room
socket.join('room1')

// Broadcast to room
io.to('room1').emit('message', 'Hello room!')

// Leave room
socket.leave('room1')
```

**Namespaces:**
- Separate communication channels
- Different endpoints (like `/chat`, `/admin`)
- Isolated connections and events
- Example: `/chat` namespace for chat, `/admin` for admin

```javascript
// Default namespace: /
const chatIO = io.of('/chat')
chatIO.on('connection', (socket) => {
  // Chat namespace logic
})
```

**Difference:**
- **Namespace**: Separate connection endpoint (`/chat`, `/admin`)
- **Room**: Group within a namespace (`room1`, `room2`)

---

## 6. How do you handle authentication with WebSockets?

**Common Methods:**

1. **Query Parameters** (Simple but less secure):
   ```javascript
   const socket = io('http://localhost:3000', {
     query: { token: 'jwt-token' }
   })
   ```

2. **Authorization Header** (Socket.io 2.0+):
   ```javascript
   const socket = io('http://localhost:3000', {
     auth: { token: 'jwt-token' }
   })
   ```

3. **Middleware Authentication**:
   ```javascript
   io.use((socket, next) => {
     const token = socket.handshake.auth.token
     if (verifyToken(token)) {
       socket.userId = getUserId(token)
       next()
     } else {
       next(new Error('Authentication failed'))
     }
   })
   ```

4. **Cookie-based** (if same domain):
   ```javascript
   // Cookies sent automatically
   io.use((socket, next) => {
     const cookies = parseCookies(socket.handshake.headers.cookie)
     if (cookies.token) {
       next()
     } else {
       next(new Error('No token'))
     }
   })
   ```

**Best Practice:** Use JWT tokens with middleware validation.

---

## 7. What are the challenges of scaling WebSocket applications?

**Challenges:**

1. **State Management**: WebSocket connections are stateful
   - Solution: Use Redis/Redis adapter for shared state

2. **Load Balancing**: Sticky sessions required
   - Problem: Client must connect to same server
   - Solution: Session affinity or Redis pub/sub

3. **Horizontal Scaling**: Multiple servers can't share connections
   - Solution: Redis adapter, message queue (RabbitMQ)

4. **Memory Usage**: Each connection consumes memory
   - Solution: Connection limits, cleanup idle connections

5. **Network Issues**: Handling disconnections, reconnections
   - Solution: Heartbeat/ping-pong, automatic reconnection

6. **Broadcasting Complexity**: Broadcasting across servers
   - Solution: Redis pub/sub, message broker

**Solutions:**
- **Socket.io Redis Adapter**: Share events across servers
- **Sticky Sessions**: Route same client to same server
- **Message Queue**: Centralized message distribution

---

## 8. What is Server-Sent Events (SSE)? How does it differ from WebSocket?

**Server-Sent Events (SSE):**
- One-way communication (server → client)
- Uses HTTP connection
- Automatic reconnection
- Text-only data
- Simpler than WebSocket

**Differences:**

| Feature | SSE | WebSocket |
|---------|-----|-----------|
| **Direction** | Server → Client only | Bidirectional |
| **Protocol** | HTTP | WebSocket |
| **Data Format** | Text/EventStream | Binary/Text |
| **Reconnection** | Automatic | Manual/Socket.io |
| **Complexity** | Simple | More complex |
| **Use Case** | Notifications, feeds | Chat, gaming |

**Example SSE:**
```javascript
// Server
res.writeHead(200, {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache'
})
res.write('data: Hello\n\n')

// Client
const eventSource = new EventSource('/events')
eventSource.onmessage = (e) => console.log(e.data)
```

**When to use:**
- **SSE**: One-way updates (notifications, live feeds)
- **WebSocket**: Bidirectional (chat, gaming, collaboration)

---

## 9. What is long polling? How does it work?

**Long Polling:**
- Client sends request → Server holds connection open
- Server responds when data is available (or timeout)
- Client immediately sends new request
- Simulates real-time updates over HTTP

**How it works:**

1. **Client Request**: Client sends HTTP request
2. **Server Holds**: Server keeps connection open (doesn't respond immediately)
3. **Data Available**: Server responds when event occurs
4. **Client Receives**: Client processes response
5. **Repeat**: Client immediately sends new request

**Example:**
```javascript
// Client
function longPoll() {
  fetch('/api/events')
    .then(res => res.json())
    .then(data => {
      handleEvent(data)
      longPoll() // Immediately request again
    })
}

// Server
app.get('/api/events', (req, res) => {
  // Wait for event (or timeout after 30s)
  eventEmitter.once('event', (data) => {
    res.json(data)
  })
  
  setTimeout(() => {
    res.json({ status: 'timeout' })
  }, 30000)
})
```

**Pros:** Works everywhere, simple
**Cons:** High overhead, not true real-time, server resource usage

---

## 10. How would you implement a real-time notification system?

**Implementation Steps:**

1. **Backend Setup** (Node.js + Socket.io):
   ```javascript
   const io = require('socket.io')(server)
   
   io.on('connection', (socket) => {
     // Authenticate user
     const userId = authenticate(socket)
     socket.join(`user-${userId}`)
   })
   
   // Send notification
   function sendNotification(userId, message) {
     io.to(`user-${userId}`).emit('notification', {
       type: 'info',
       message: message,
       timestamp: Date.now()
     })
   }
   ```

2. **Frontend Setup**:
   ```javascript
   const socket = io('http://localhost:3000', {
     auth: { token: userToken }
   })
   
   socket.on('notification', (data) => {
     showNotification(data.message)
     updateNotificationBadge()
   })
   ```

3. **Database Integration**:
   - Store notifications in database
   - Mark as read/unread
   - Query unread notifications on login

4. **Features:**
   - User-specific rooms (`user-${userId}`)
   - Notification persistence
   - Read/unread status
   - Notification history
   - Push notifications (if needed)

**Architecture:**
```
User Action → Backend → Database → Socket.io → Client
                                    ↓
                            Real-time Notification
```

**Best Practices:**
- Use rooms for user-specific notifications
- Store notifications in database
- Implement read/unread tracking
- Handle offline users (queue notifications)
- Rate limiting for notification spam

---

## License

ISC

