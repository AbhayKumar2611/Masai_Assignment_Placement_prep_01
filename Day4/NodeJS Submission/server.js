const express = require('express')
const connectToDB = require('./configs/mongo.db')
const {
    rateLimiter,
    strictRateLimiter,
    lenientRateLimiter,
    resetIpLimit,
    resetAllLimits,
    getRateLimitStatus,
    getAllRateLimitStatuses,
} = require('./middleware/rateLimiter.middleware')

const app = express()
app.use(express.json())

// MongoDB Connection
connectToDB()

// Apply global rate limiter to all routes (10 requests per minute)
app.use(rateLimiter)

// Test route - uses global rate limiter
app.get('/test', (req, res) => {
    res.status(200).json({
        message: "This is test route",
        rateLimit: {
            limit: 10,
            window: "1 minute"
        }
    })
})

// Public route with lenient rate limiting (30 requests per minute)
app.get('/public', lenientRateLimiter, (req, res) => {
    res.status(200).json({
        message: "Public endpoint with lenient rate limiting",
        rateLimit: {
            limit: 30,
            window: "1 minute"
        }
    })
})

// Sensitive route with strict rate limiting (5 requests per minute)
app.post('/login', strictRateLimiter, (req, res) => {
    res.status(200).json({
        message: "Login endpoint with strict rate limiting",
        rateLimit: {
            limit: 5,
            window: "1 minute"
        }
    })
})

// Admin routes for managing rate limits
app.get('/admin/rate-limits', (req, res) => {
    const statuses = getAllRateLimitStatuses()
    res.status(200).json({
        message: "All active rate limits",
        count: statuses.length,
        rateLimits: statuses
    })
})

app.get('/admin/rate-limits/:ip', (req, res) => {
    const { ip } = req.params
    const status = getRateLimitStatus(ip)
    
    if (!status) {
        return res.status(404).json({
            message: "No rate limit data found for this IP"
        })
    }
    
    res.status(200).json({
        message: "Rate limit status for IP",
        status
    })
})

app.delete('/admin/rate-limits/:ip', (req, res) => {
    const { ip } = req.params
    const success = resetIpLimit(ip)
    
    if (!success) {
        return res.status(404).json({
            message: "No rate limit data found for this IP"
        })
    }
    
    res.status(200).json({
        message: "Rate limit reset successfully for IP",
        ip
    })
})

app.delete('/admin/rate-limits', (req, res) => {
    resetAllLimits()
    res.status(200).json({
        message: "All rate limits have been reset"
    })
})

// 404 handler - should be last
app.use((req, res) => {
    res.status(404).json({message: "This route is not defined"})
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Your server is running on http://localhost:${PORT}`)
    console.log(`Rate limiting is active:`)
    console.log(`  - Global: 10 requests/minute`)
    console.log(`  - Strict: 5 requests/minute (for /login)`)
    console.log(`  - Lenient: 30 requests/minute (for /public)`)
})