const express = require('express')
const connectToDB = require('./configs/mongo.db')
const productRoutes = require('./routes/product.routes')

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
connectToDB()

// Routes
app.use('/api/products', productRoutes)

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
        message: 'Search & Filter API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            products: {
                getAll: 'GET /api/products',
                search: 'GET /api/products/search',
                analyze: 'GET /api/products/search/analyze',
                getById: 'GET /api/products/:id',
                create: 'POST /api/products'
            }
        }
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log(`Health check: http://localhost:${PORT}/health`)
    console.log(`API endpoint: http://localhost:${PORT}/api/products`)
})

module.exports = app

