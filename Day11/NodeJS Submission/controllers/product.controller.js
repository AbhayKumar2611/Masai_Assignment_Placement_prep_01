const Product = require('../models/product.model')

/**
 * Search and Filter Products
 * GET /api/products/search
 * 
 * Query Parameters:
 * - search: Text search query (searches name and description)
 * - category: Filter by category (Electronics, Clothing, Books, etc.)
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - minRating: Minimum rating filter (0-5)
 * - maxRating: Maximum rating filter (0-5)
 * - inStock: Filter by stock availability (true/false)
 * - brand: Filter by brand name (case-insensitive)
 * - sortBy: Field to sort by (name, price, rating, createdAt)
 * - sortOrder: Sort order (asc/desc)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * 
 * Examples:
 * GET /api/products/search?category=Electronics&minPrice=100&maxPrice=500&sortBy=price&sortOrder=asc
 * GET /api/products/search?search=laptop&minRating=4&page=1&limit=20
 */
const searchAndFilterProducts = async (req, res) => {
    try {
        const queryOptions = {
            search: req.query.search,
            category: req.query.category,
            minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
            minRating: req.query.minRating ? parseFloat(req.query.minRating) : undefined,
            maxRating: req.query.maxRating ? parseFloat(req.query.maxRating) : undefined,
            inStock: req.query.inStock,
            brand: req.query.brand,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc',
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10
        }

        const result = await Product.searchAndFilter(queryOptions)

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: result.products,
            pagination: result.pagination
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching products',
            error: error.message
        })
    }
}

/**
 * Get All Products (with basic filtering)
 * GET /api/products
 */
const getAllProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const [products, total] = await Promise.all([
            Product.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .select('-__v'),
            Product.countDocuments()
        ])

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: products,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: error.message
        })
    }
}

/**
 * Get Product by ID
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select('-__v')

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Product retrieved successfully',
            data: product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        })
    }
}

/**
 * Create Product
 * POST /api/products
 */
const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body)
        const savedProduct = await product.save()

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: savedProduct
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        })
    }
}

/**
 * Analyze Query Performance
 * GET /api/products/search/analyze
 * Uses explain() to analyze query execution
 */
const analyzeQuery = async (req, res) => {
    try {
        const queryOptions = {
            search: req.query.search,
            category: req.query.category,
            minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
            minRating: req.query.minRating ? parseFloat(req.query.minRating) : undefined,
            maxRating: req.query.maxRating ? parseFloat(req.query.maxRating) : undefined,
            inStock: req.query.inStock,
            brand: req.query.brand,
            sortBy: req.query.sortBy || 'createdAt',
            sortOrder: req.query.sortOrder || 'desc'
        }

        // Build filter (same as searchAndFilterProducts)
        const filter = {}
        if (queryOptions.search) filter.$text = { $search: queryOptions.search }
        if (queryOptions.category) filter.category = queryOptions.category
        if (queryOptions.minPrice !== undefined || queryOptions.maxPrice !== undefined) {
            filter.price = {}
            if (queryOptions.minPrice !== undefined) filter.price.$gte = queryOptions.minPrice
            if (queryOptions.maxPrice !== undefined) filter.price.$lte = queryOptions.maxPrice
        }
        if (queryOptions.minRating !== undefined || queryOptions.maxRating !== undefined) {
            filter.rating = {}
            if (queryOptions.minRating !== undefined) filter.rating.$gte = queryOptions.minRating
            if (queryOptions.maxRating !== undefined) filter.rating.$lte = queryOptions.maxRating
        }
        if (queryOptions.inStock !== undefined) {
            filter.inStock = queryOptions.inStock === true || queryOptions.inStock === 'true'
        }

        const sort = {}
        if (queryOptions.sortBy) {
            sort[queryOptions.sortBy] = queryOptions.sortOrder === 'asc' ? 1 : -1
        }

        // Execute explain() to analyze query
        const explanation = await Product.find(filter).sort(sort).explain('executionStats')

        res.status(200).json({
            success: true,
            message: 'Query analysis completed',
            analysis: {
                executionStats: explanation[0]?.executionStats || explanation.executionStats,
                queryPlanner: explanation[0]?.queryPlanner || explanation.queryPlanner,
                indexesUsed: explanation[0]?.queryPlanner?.winningPlan?.inputStage?.indexName || 'Collection Scan'
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error analyzing query',
            error: error.message
        })
    }
}

module.exports = {
    searchAndFilterProducts,
    getAllProducts,
    getProductById,
    createProduct,
    analyzeQuery
}

