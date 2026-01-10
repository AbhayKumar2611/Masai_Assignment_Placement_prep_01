const express = require('express')
const router = express.Router()
const {
    searchAndFilterProducts,
    getAllProducts,
    getProductById,
    createProduct,
    analyzeQuery
} = require('../controllers/product.controller')

/**
 * Product Routes
 * 
 * All routes are prefixed with /api/products
 */

// Search and filter products (advanced)
router.get('/search', searchAndFilterProducts)

// Analyze query performance
router.get('/search/analyze', analyzeQuery)

// Get all products (with pagination)
router.get('/', getAllProducts)

// Get product by ID
router.get('/:id', getProductById)

// Create new product
router.post('/', createProduct)

module.exports = router

