const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*', // In production, specify your frontend URL
        methods: ['GET', 'POST']
    }
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

// File filter - accept all file types for this example
const fileFilter = (req, file, cb) => {
    // Optional: Add file type validation here
    // if (file.mimetype.startsWith('image/')) {
    //     cb(null, true)
    // } else {
    //     cb(new Error('Only image files are allowed!'), false)
    // }
    cb(null, true)
}

// Multer upload configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB max file size
    }
})

// Store active uploads (uploadId -> uploadInfo)
const activeUploads = new Map()

/**
 * Socket.io Connection Handling
 */
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`)
        // Clean up any active uploads for this socket
        for (const [uploadId, uploadInfo] of activeUploads.entries()) {
            if (uploadInfo.socketId === socket.id) {
                activeUploads.delete(uploadId)
            }
        }
    })

    // Handle upload cancellation
    socket.on('cancel-upload', (data) => {
        const { uploadId } = data
        const uploadInfo = activeUploads.get(uploadId)
        
        if (uploadInfo && uploadInfo.socketId === socket.id) {
            // Mark upload as cancelled
            uploadInfo.cancelled = true
            
            // Delete the file if it exists
            if (fs.existsSync(uploadInfo.filePath)) {
                fs.unlinkSync(uploadInfo.filePath)
            }
            
            // Remove from active uploads
            activeUploads.delete(uploadId)
            
            socket.emit('upload-cancelled', { uploadId })
            console.log(`Upload cancelled: ${uploadId}`)
        }
    })
})

/**
 * File Upload Endpoint with Progress Tracking
 * POST /api/upload
 */
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            })
        }

        const socketId = req.headers['x-socket-id'] // Client sends socket ID
        const clientUploadId = req.headers['x-upload-id'] || uuidv4() // Client can send upload ID, or server generates one
        const uploadId = clientUploadId // Use client's upload ID if provided, otherwise use server-generated
        const filePath = req.file.path
        const fileSize = req.file.size
        const fileName = req.file.originalname

        // Store upload information
        const uploadInfo = {
            uploadId,
            socketId,
            fileName,
            filePath,
            fileSize,
            startTime: Date.now(),
            cancelled: false
        }
        activeUploads.set(uploadId, uploadInfo)

        // Start file processing with progress tracking
        processFileWithProgress(uploadId, socketId, filePath, fileSize, fileName)

        res.status(200).json({
            success: true,
            message: 'File upload started',
            data: {
                uploadId, // Return the upload ID so client can track it
                fileName,
                fileSize,
                filePath: `/uploads/${req.file.filename}`
            }
        })
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({
            success: false,
            message: 'Error uploading file',
            error: error.message
        })
    }
})

/**
 * Simulate file processing with progress updates
 * In a real scenario, this would be actual file processing
 */
const processFileWithProgress = async (uploadId, socketId, filePath, fileSize, fileName) => {
    const uploadInfo = activeUploads.get(uploadId)
    if (!uploadInfo || uploadInfo.cancelled) {
        return
    }

    const socket = io.sockets.sockets.get(socketId)
    if (!socket) {
        console.log(`Socket ${socketId} not found for upload ${uploadId}`)
        activeUploads.delete(uploadId)
        return
    }

    try {
        // Simulate processing in chunks (progress updates)
        const chunks = 100 // Number of progress updates
        const chunkSize = fileSize / chunks
        let currentBytes = 0

        // Read file in chunks and emit progress
        const fileStream = fs.createReadStream(filePath)
        let totalBytesRead = 0

        fileStream.on('data', (chunk) => {
            if (uploadInfo.cancelled) {
                fileStream.destroy()
                return
            }

            totalBytesRead += chunk.length
            const percentage = Math.round((totalBytesRead / fileSize) * 100)

            // Emit progress update
            socket.emit('upload-progress', {
                uploadId,
                fileName,
                percentage: Math.min(percentage, 99), // Cap at 99% until completion
                bytesUploaded: totalBytesRead,
                totalBytes: fileSize,
                speed: calculateSpeed(uploadInfo.startTime, totalBytesRead)
            })

            // Small delay to simulate processing
            currentBytes += chunkSize
        })

        fileStream.on('end', () => {
            if (uploadInfo.cancelled) {
                return
            }

            // Process completed
            const endTime = Date.now()
            const duration = (endTime - uploadInfo.startTime) / 1000 // seconds
            const averageSpeed = fileSize / duration

            // Final progress update (100%)
            socket.emit('upload-progress', {
                uploadId,
                fileName,
                percentage: 100,
                bytesUploaded: fileSize,
                totalBytes: fileSize,
                speed: averageSpeed,
                duration: duration.toFixed(2)
            })

            // Emit completion
            socket.emit('upload-complete', {
                uploadId,
                fileName,
                filePath: `/uploads/${path.basename(filePath)}`,
                fileSize,
                duration: duration.toFixed(2),
                averageSpeed: (averageSpeed / 1024).toFixed(2) + ' KB/s'
            })

            // Clean up
            activeUploads.delete(uploadId)
            console.log(`Upload completed: ${uploadId} - ${fileName}`)
        })

        fileStream.on('error', (error) => {
            console.error(`File stream error for ${uploadId}:`, error)
            
            // Emit error
            socket.emit('upload-error', {
                uploadId,
                fileName,
                error: error.message
            })

            // Clean up
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath)
            }
            activeUploads.delete(uploadId)
        })

    } catch (error) {
        console.error(`Processing error for ${uploadId}:`, error)
        
        const socket = io.sockets.sockets.get(socketId)
        if (socket) {
            socket.emit('upload-error', {
                uploadId,
                fileName,
                error: error.message
            })
        }

        // Clean up
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }
        activeUploads.delete(uploadId)
    }
}

/**
 * Calculate upload speed
 */
const calculateSpeed = (startTime, bytesUploaded) => {
    const duration = (Date.now() - startTime) / 1000 // seconds
    if (duration === 0) return 0
    const speed = bytesUploaded / duration // bytes per second
    return (speed / 1024).toFixed(2) + ' KB/s' // Convert to KB/s
}

/**
 * Get upload status endpoint
 * GET /api/upload/:uploadId/status
 */
app.get('/api/upload/:uploadId/status', (req, res) => {
    const { uploadId } = req.params
    const uploadInfo = activeUploads.get(uploadId)

    if (!uploadInfo) {
        return res.status(404).json({
            success: false,
            message: 'Upload not found'
        })
    }

    res.status(200).json({
        success: true,
        data: {
            uploadId,
            fileName: uploadInfo.fileName,
            fileSize: uploadInfo.fileSize,
            startTime: uploadInfo.startTime,
            cancelled: uploadInfo.cancelled
        }
    })
})

/**
 * Get all active uploads
 * GET /api/uploads/active
 */
app.get('/api/uploads/active', (req, res) => {
    const activeUploadsArray = Array.from(activeUploads.values()).map(upload => ({
        uploadId: upload.uploadId,
        fileName: upload.fileName,
        fileSize: upload.fileSize,
        startTime: upload.startTime,
        cancelled: upload.cancelled
    }))

    res.status(200).json({
        success: true,
        data: {
            count: activeUploadsArray.length,
            uploads: activeUploadsArray
        }
    })
})

/**
 * Serve static files from uploads directory
 */
app.use('/uploads', express.static(uploadsDir))

/**
 * Serve client example HTML
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 100MB.'
            })
        }
        return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: err.message
        })
    }

    console.error('Error:', err)
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📡 Socket.io server ready`)
    console.log(`📁 Uploads directory: ${uploadsDir}`)
    console.log(`\n📝 Test the upload at: http://localhost:${PORT}`)
})

module.exports = { app, server, io }

