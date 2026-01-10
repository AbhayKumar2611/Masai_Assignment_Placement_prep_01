const mongoose = require('mongoose')

/**
 * Order Schema
 * Used for aggregation pipeline examples
 * Includes reference to User and Product collections
 */

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Food', 'Beauty'],
        index: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    _id: false
})

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    orderNumber: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
        index: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        index: true
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
        required: true
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    orderDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
})

// Indexes for aggregation queries
orderSchema.index({ userId: 1, orderDate: -1 })
orderSchema.index({ 'items.category': 1, totalAmount: 1 })
orderSchema.index({ status: 1, orderDate: -1 })

const Order = mongoose.model('Order', orderSchema)

module.exports = Order

