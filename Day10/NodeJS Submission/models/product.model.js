const mongoose = require('mongoose')

/**
 * Product Schema
 * MongoDB Schema for Product Catalog
 * Includes indexes for efficient querying
 */

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        index: true // Index for text search and sorting
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        index: true // Index for text search
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Food', 'Beauty'],
        index: true // Index for filtering by category
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be positive'],
        index: true // Index for price range queries and sorting
    },
    stock: {
        type: Number,
        required: [true, 'Stock is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    brand: {
        type: String,
        trim: true,
        index: true // Index for brand filtering
    },
    tags: [{
        type: String,
        trim: true
    }],
    inStock: {
        type: Boolean,
        default: true,
        index: true // Index for stock availability filtering
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true // Index for sorting by creation date
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
})

// Text index for full-text search across name and description
productSchema.index({ name: 'text', description: 'text' })

// Compound index for common query patterns
productSchema.index({ category: 1, price: 1 })
productSchema.index({ category: 1, inStock: 1 })

const Product = mongoose.model('Product', productSchema)

module.exports = Product

