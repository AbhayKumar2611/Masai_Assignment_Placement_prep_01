const mongoose = require('mongoose')

/**
 * User Schema
 * Used for demonstrating validation and error handling
 */

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Don't return password in queries by default
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [18, 'Age must be at least 18'],
        max: [120, 'Age must be less than or equal to 120']
    },
    name: {
        type: String,
        trim: true
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

