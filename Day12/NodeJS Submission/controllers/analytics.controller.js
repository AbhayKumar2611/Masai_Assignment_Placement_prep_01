const Order = require('../models/order.model')
const User = require('../models/user.model')

/**
 * Group Orders by User
 * GET /api/analytics/orders-by-user
 * 
 * Aggregation pipeline:
 * 1. $match - Filter orders (optional)
 * 2. $group - Group orders by user, calculate statistics
 * 3. $lookup - Join with User collection to get user details
 * 4. $project - Shape the output
 * 5. $sort - Sort by total orders or total amount
 */
const getOrdersByUser = async (req, res) => {
    try {
        const { status, startDate, endDate, sortBy = 'totalOrders', sortOrder = 'desc' } = req.query

        // Build match stage
        const matchStage = {}

        if (status) {
            matchStage.status = status
        }

        if (startDate || endDate) {
            matchStage.orderDate = {}
            if (startDate) {
                matchStage.orderDate.$gte = new Date(startDate)
            }
            if (endDate) {
                matchStage.orderDate.$lte = new Date(endDate)
            }
        }

        const pipeline = [
            // Stage 1: Match (filter orders)
            ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),

            // Stage 2: Group by user and calculate statistics
            {
                $group: {
                    _id: '$userId',
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' },
                    averageOrderValue: { $avg: '$totalAmount' },
                    orders: {
                        $push: {
                            orderNumber: '$orderNumber',
                            totalAmount: '$totalAmount',
                            orderDate: '$orderDate',
                            status: '$status'
                        }
                    }
                }
            },

            // Stage 3: Lookup - Join with User collection
            {
                $lookup: {
                    from: 'users', // Collection name in MongoDB (usually pluralized)
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },

            // Stage 4: Unwind user details array (since lookup returns array)
            {
                $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true // Include orders even if user not found
                }
            },

            // Stage 5: Project - Shape the output
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    userName: '$userDetails.name',
                    userEmail: '$userDetails.email',
                    totalOrders: 1,
                    totalAmount: { $round: ['$totalAmount', 2] },
                    averageOrderValue: { $round: ['$averageOrderValue', 2] },
                    orders: 1
                }
            },

            // Stage 6: Sort
            {
                $sort: {
                    [sortBy]: sortOrder === 'asc' ? 1 : -1
                }
            }
        ]

        const results = await Order.aggregate(pipeline)

        res.status(200).json({
            success: true,
            message: 'Orders grouped by user successfully',
            data: results,
            count: results.length
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error grouping orders by user',
            error: error.message
        })
    }
}

/**
 * Calculate Total Sales per Category
 * GET /api/analytics/sales-by-category
 * 
 * Aggregation pipeline:
 * 1. $match - Filter orders (optional)
 * 2. $unwind - Deconstruct items array
 * 3. $group - Group by category, calculate total sales
 * 4. $project - Shape the output
 * 5. $sort - Sort by total sales
 */
const getSalesByCategory = async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query

        // Build match stage
        const matchStage = {}

        if (status) {
            matchStage.status = status
        }

        if (startDate || endDate) {
            matchStage.orderDate = {}
            if (startDate) {
                matchStage.orderDate.$gte = new Date(startDate)
            }
            if (endDate) {
                matchStage.orderDate.$lte = new Date(endDate)
            }
        }

        const pipeline = [
            // Stage 1: Match (filter orders)
            ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),

            // Stage 2: Unwind items array (deconstruct array to process each item)
            {
                $unwind: '$items'
            },

            // Stage 3: Group by category and calculate statistics
            {
                $group: {
                    _id: '$items.category',
                    totalSales: { $sum: '$items.subtotal' },
                    totalQuantity: { $sum: '$items.quantity' },
                    totalOrders: { $sum: 1 },
                    averageItemPrice: { $avg: '$items.price' },
                    averageOrderValue: { $avg: '$items.subtotal' },
                    products: { $addToSet: '$items.productName' } // Unique products
                }
            },

            // Stage 4: Project - Shape the output
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    totalSales: { $round: ['$totalSales', 2] },
                    totalQuantity: 1,
                    totalOrders: 1,
                    averageItemPrice: { $round: ['$averageItemPrice', 2] },
                    averageOrderValue: { $round: ['$averageOrderValue', 2] },
                    uniqueProductsCount: { $size: '$products' },
                    products: 1
                }
            },

            // Stage 5: Sort by total sales descending
            {
                $sort: { totalSales: -1 }
            }
        ]

        const results = await Order.aggregate(pipeline)

        // Calculate grand total
        const grandTotal = results.reduce((sum, item) => sum + item.totalSales, 0)

        res.status(200).json({
            success: true,
            message: 'Sales by category calculated successfully',
            data: results,
            summary: {
                totalCategories: results.length,
                grandTotalSales: Math.round(grandTotal * 100) / 100
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error calculating sales by category',
            error: error.message
        })
    }
}

/**
 * Find Top 5 Customers by Spending
 * GET /api/analytics/top-customers
 * 
 * Aggregation pipeline:
 * 1. $match - Filter orders (optional)
 * 2. $group - Group by user, calculate total spending
 * 3. $lookup - Join with User collection
 * 4. $unwind - Unwind user details
 * 5. $project - Shape the output
 * 6. $sort - Sort by total spending
 * 7. $limit - Limit to top 5
 */
const getTopCustomers = async (req, res) => {
    try {
        const { limit = 5, status, startDate, endDate } = req.query

        // Build match stage
        const matchStage = {}

        if (status) {
            matchStage.status = status
        }

        if (startDate || endDate) {
            matchStage.orderDate = {}
            if (startDate) {
                matchStage.orderDate.$gte = new Date(startDate)
            }
            if (endDate) {
                matchStage.orderDate.$lte = new Date(endDate)
            }
        }

        const pipeline = [
            // Stage 1: Match (filter orders)
            ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),

            // Stage 2: Group by user and calculate total spending
            {
                $group: {
                    _id: '$userId',
                    totalSpending: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                    averageOrderValue: { $avg: '$totalAmount' },
                    firstOrderDate: { $min: '$orderDate' },
                    lastOrderDate: { $max: '$orderDate' }
                }
            },

            // Stage 3: Lookup - Join with User collection
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },

            // Stage 4: Unwind user details
            {
                $unwind: {
                    path: '$userDetails',
                    preserveNullAndEmptyArrays: true
                }
            },

            // Stage 5: Project - Shape the output
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    userName: '$userDetails.name',
                    userEmail: '$userDetails.email',
                    totalSpending: { $round: ['$totalSpending', 2] },
                    totalOrders: 1,
                    averageOrderValue: { $round: ['$averageOrderValue', 2] },
                    firstOrderDate: 1,
                    lastOrderDate: 1
                }
            },

            // Stage 6: Sort by total spending descending
            {
                $sort: { totalSpending: -1 }
            },

            // Stage 7: Limit to top N customers
            {
                $limit: parseInt(limit)
            }
        ]

        const results = await Order.aggregate(pipeline)

        res.status(200).json({
            success: true,
            message: `Top ${limit} customers retrieved successfully`,
            data: results,
            count: results.length
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching top customers',
            error: error.message
        })
    }
}

/**
 * Get All Analytics (Combined)
 * GET /api/analytics/summary
 */
const getAnalyticsSummary = async (req, res) => {
    try {
        const { status, startDate, endDate } = req.query

        // Build match stage
        const matchStage = {}

        if (status) {
            matchStage.status = status
        }

        if (startDate || endDate) {
            matchStage.orderDate = {}
            if (startDate) {
                matchStage.orderDate.$gte = new Date(startDate)
            }
            if (endDate) {
                matchStage.orderDate.$lte = new Date(endDate)
            }
        }

        // Get orders by user (simplified)
        const ordersByUserPipeline = [
            ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
            {
                $group: {
                    _id: '$userId',
                    totalOrders: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            },
            {
                $count: 'totalUsers'
            }
        ]

        // Get sales by category
        const salesByCategoryPipeline = [
            ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.category',
                    totalSales: { $sum: '$items.subtotal' }
                }
            },
            { $sort: { totalSales: -1 } }
        ]

        // Get top customers
        const topCustomersPipeline = [
            ...(Object.keys(matchStage).length > 0 ? [{ $match: matchStage }] : []),
            {
                $group: {
                    _id: '$userId',
                    totalSpending: { $sum: '$totalAmount' }
                }
            },
            { $sort: { totalSpending: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    userId: '$_id',
                    userName: '$userDetails.name',
                    totalSpending: { $round: ['$totalSpending', 2] }
                }
            }
        ]

        const [ordersByUser, salesByCategory, topCustomers] = await Promise.all([
            Order.aggregate(ordersByUserPipeline),
            Order.aggregate(salesByCategoryPipeline),
            Order.aggregate(topCustomersPipeline)
        ])

        res.status(200).json({
            success: true,
            message: 'Analytics summary retrieved successfully',
            data: {
                ordersByUser: {
                    totalUsers: ordersByUser[0]?.totalUsers || 0
                },
                salesByCategory: salesByCategory.map(item => ({
                    category: item._id,
                    totalSales: Math.round(item.totalSales * 100) / 100
                })),
                topCustomers: topCustomers
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics summary',
            error: error.message
        })
    }
}

module.exports = {
    getOrdersByUser,
    getSalesByCategory,
    getTopCustomers,
    getAnalyticsSummary
}

