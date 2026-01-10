const express = require('express')
const connectToDB = require('./configs/mongo.db')
const productRoutes = require('./routes/product.routes')
const userRoutes = require('./routes/user.routes')
const { errorHandler, handleUnhandledRejections, handleUncaughtExceptions } = require('./middleware/errorHandler')

const app = express()

// Handle uncaught exceptions (should be at the top)
handleUncaughtExceptions()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
connectToDB()

// Routes
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    })
})

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Validation & Error Handler System API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            products: {
                create: 'POST /api/products',
                getAll: 'GET /api/products?search=&category=&minPrice=&maxPrice=&brand=&inStock=&sortBy=&sortOrder=&page=&limit=',
                getById: 'GET /api/products/:id',
                update: 'PUT /api/products/:id',
                patch: 'PATCH /api/products/:id',
                delete: 'DELETE /api/products/:id'
            },
            users: {
                register: 'POST /api/users/register',
                getAll: 'GET /api/users',
                getById: 'GET /api/users/:id',
                update: 'PUT /api/users/:id',
                delete: 'DELETE /api/users/:id'
            }
        }
    })
})

// 404 handler (must be before error handler)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        status: 'fail',
        message: `Route ${req.originalUrl} not found`
    })
})

// Centralized Error Handler Middleware (must be last)
app.use(errorHandler)

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/health`)
    console.log(`API endpoints: http://localhost:${PORT}/api/users | http://localhost:${PORT}/api/products`)
})

// Handle unhandled promise rejections
handleUnhandledRejections()

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully')
    server.close(() => {
        console.log('Process terminated!')
    })
})

module.exports = app

