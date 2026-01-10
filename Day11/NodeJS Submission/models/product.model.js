const mongoose = require('mongoose')

/**
 * Product Schema with Indexing Strategy
 * 
 * INDEXING STRATEGY:
 * 1. Compound Index: { category: 1, price: 1, rating: -1 }
 *    - Optimizes queries filtering by category, price range, and sorting by rating
 *    - Index order matters: category first (most selective), then price, then rating
 * 
 * 2. Text Index: { name: "text", description: "text" }
 *    - Enables full-text search across product name and description
 *    - Single field text indexes can also be created individually
 * 
 * 3. Single Field Indexes:
 *    - rating: -1 (for sorting by rating descending)
 *    - price: 1 (for sorting by price ascending)
 *    - createdAt: -1 (for sorting by newest first)
 * 
 * 4. Compound Index for Common Query Patterns:
 *    - { category: 1, inStock: 1 } - for filtering available products by category
 *    - { price: 1, rating: -1 } - for sorting by price then rating
 */

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        index: true // Single field index for exact name searches
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys'],
        index: true // Single field index for category filtering
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be positive'],
        index: true // Single field index for price range queries and sorting
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating cannot exceed 5'],
        index: true // Single field index for rating filtering and sorting
    },
    inStock: {
        type: Boolean,
        default: true,
        index: true // Single field index for stock availability filtering
    },
    brand: {
        type: String,
        trim: true,
        index: true // Single field index for brand filtering
    },
    tags: [{
        type: String,
        trim: true
    }],
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

// Compound Index: Category, Price, Rating
// This index supports queries like:
// - Find products in a category with price range, sorted by rating
// Index order: category (most selective) -> price (range filter) -> rating (sort)
productSchema.index({ category: 1, price: 1, rating: -1 })

// Compound Index: Category and Stock Status
// Optimizes queries filtering by category and availability
productSchema.index({ category: 1, inStock: 1 })

// Compound Index: Price and Rating
// Supports queries sorting by price and rating
productSchema.index({ price: 1, rating: -1 })

// Text Index for Full-Text Search
// Enables text search across name and description fields
// MongoDB creates one text index per collection, so we combine fields
// Note: Text index cannot be combined with regular indexes in compound index
productSchema.index({ name: 'text', description: 'text' })

// Additional compound index for category + text search scenarios
// Used when filtering by category first, then applying text search
// Note: MongoDB will use index intersection for category filter, then text index for search
productSchema.index({ category: 1 })

/**
 * INDEX USAGE NOTES:
 * 
 * 1. Query Selectivity: More selective fields should come first in compound indexes
 *    - category is more selective than price (fewer distinct values)
 *    - price is more selective than rating (more distinct values)
 * 
 * 2. Equality, Sort, Range (ESR) Rule:
 *    - Equality fields first (category)
 *    - Sort fields next (rating)
 *    - Range fields last (price)
 *    However, MongoDB query optimizer can use index efficiently even if order differs
 * 
 * 3. Index Intersection: MongoDB can use multiple indexes and combine results
 *    For queries that don't match a single index perfectly
 * 
 * 4. Covered Queries: If all fields in query result are in index, MongoDB can
 *    return results without accessing documents (faster performance)
 * 
 * 5. Index Maintenance: Indexes improve read performance but slow down writes
 *    Balance between read and write performance based on application needs
 */

// Static method for search and filter
productSchema.statics.searchAndFilter = async function(queryOptions) {
    const {
        search,
        category,
        minPrice,
        maxPrice,
        minRating,
        maxRating,
        inStock,
        brand,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 10
    } = queryOptions

    // Build filter object
    const filter = {}

    // Text search
    if (search) {
        filter.$text = { $search: search }
    }

    // Category filter
    if (category) {
        filter.category = category
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {}
        if (minPrice !== undefined) {
            filter.price.$gte = minPrice
        }
        if (maxPrice !== undefined) {
            filter.price.$lte = maxPrice
        }
    }

    // Rating range filter
    if (minRating !== undefined || maxRating !== undefined) {
        filter.rating = {}
        if (minRating !== undefined) {
            filter.rating.$gte = minRating
        }
        if (maxRating !== undefined) {
            filter.rating.$lte = maxRating
        }
    }

    // Stock filter
    if (inStock !== undefined) {
        filter.inStock = inStock === true || inStock === 'true'
    }

    // Brand filter
    if (brand) {
        filter.brand = new RegExp(brand, 'i') // Case-insensitive regex search
    }

    // Build sort object
    const sort = {}
    if (sortBy) {
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1
    }

    // Pagination
    const skip = (page - 1) * limit
    const pageLimit = parseInt(limit)

    // Execute query with pagination
    const [products, total] = await Promise.all([
        this.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageLimit)
            .select('-__v'), // Exclude version field
        this.countDocuments(filter)
    ])

    return {
        products,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / pageLimit),
            totalItems: total,
            itemsPerPage: pageLimit,
            hasNextPage: page < Math.ceil(total / pageLimit),
            hasPrevPage: page > 1
        }
    }
}

const Product = mongoose.model('Product', productSchema)

module.exports = Product

