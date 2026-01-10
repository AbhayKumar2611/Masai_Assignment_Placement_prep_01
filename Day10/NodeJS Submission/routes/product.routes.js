const express = require('express')
const router = express.Router()
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    patchProduct,
    deleteProduct
} = require('../controllers/product.controller')

/**
 * Product Routes
 * 
 * All routes are prefixed with /api/products
 */

// Create product
router.post('/', createProduct)

// Get all products (with filters, pagination, sorting, text search)
router.get('/', getProducts)

// Get product by ID
router.get('/:id', getProductById)

// Update product (full update)
router.put('/:id', updateProduct)

// Partial update product
router.patch('/:id', patchProduct)

// Delete product
router.delete('/:id', deleteProduct)

module.exports = router

