const express = require('express')
const router = express.Router()
const {
    getOrdersByUser,
    getSalesByCategory,
    getTopCustomers,
    getAnalyticsSummary
} = require('../controllers/analytics.controller')

/**
 * Analytics Routes
 * 
 * All routes are prefixed with /api/analytics
 */

// Get orders grouped by user
router.get('/orders-by-user', getOrdersByUser)

// Get total sales per category
router.get('/sales-by-category', getSalesByCategory)

// Get top customers by spending
router.get('/top-customers', getTopCustomers)

// Get analytics summary (combined)
router.get('/summary', getAnalyticsSummary)

module.exports = router

