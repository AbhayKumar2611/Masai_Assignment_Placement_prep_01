const Product = require('../models/product.model')

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
 * Read Products (with filters, pagination, sorting, text search)
 * GET /api/products
 * 
 * Query Parameters:
 * - search: Text search query (searches name and description)
 * - category: Filter by category
 * - minPrice: Minimum price filter
 * - maxPrice: Maximum price filter
 * - brand: Filter by brand name
 * - inStock: Filter by stock availability (true/false)
 * - sortBy: Field to sort by (name, price, createdAt, etc.)
 * - sortOrder: Sort order (asc/desc)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 */
const getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            brand,
            inStock,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 10
        } = req.query

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
                filter.price.$gte = parseFloat(minPrice)
            }
            if (maxPrice !== undefined) {
                filter.price.$lte = parseFloat(maxPrice)
            }
        }

        // Brand filter (case-insensitive)
        if (brand) {
            filter.brand = new RegExp(brand, 'i')
        }

        // Stock filter
        if (inStock !== undefined) {
            filter.inStock = inStock === 'true' || inStock === true
        }

        // Build sort object
        const sort = {}
        if (sortBy) {
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1
        }

        // If text search is used, add text score to sort
        if (search) {
            sort.score = { $meta: 'textScore' }
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit)
        const pageLimit = parseInt(limit)

        // Execute query with pagination
        let query = Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageLimit)

        // Add text score projection if text search is used
        if (search) {
            query = query.select({ score: { $meta: 'textScore' } })
        }

        const [products, total] = await Promise.all([
            query.lean(),
            Product.countDocuments(filter)
        ])

        res.status(200).json({
            success: true,
            message: 'Products retrieved successfully',
            data: products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / pageLimit),
                totalItems: total,
                itemsPerPage: pageLimit,
                hasNextPage: parseInt(page) < Math.ceil(total / pageLimit),
                hasPrevPage: parseInt(page) > 1
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
 * Read Product by ID
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

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
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            })
        }

        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        })
    }
}

/**
 * Update Product
 * PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                updatedAt: Date.now()
            },
            {
                new: true, // Return updated document
                runValidators: true // Run schema validators
            }
        )

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        })
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            })
        }

        res.status(400).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        })
    }
}

/**
 * Partial Update Product (PATCH)
 * PATCH /api/products/:id
 */
const patchProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    ...req.body,
                    updatedAt: Date.now()
                }
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        })
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            })
        }

        res.status(400).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        })
    }
}

/**
 * Delete Product
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: product
        })
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            })
        }

        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        })
    }
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    patchProduct,
    deleteProduct
}

