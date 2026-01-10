const mongoose = require('mongoose')

/**
 * User Schema
 * Used for aggregation pipeline examples
 */

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    phone: {
        type: String,
        trim: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User

