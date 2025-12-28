const jwt = require('jsonwebtoken')
const User = require('../models/user.models')

// Middleware to verify JWT token from cookies
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.authToken

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided. Please login first.'
            })
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        // Get user from database (excluding password)
        const user = await User.findById(decoded.userId).select('-password')
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Token is invalid.'
            })
        }

        // Attach user to request object
        req.user = user
        next()
    } catch (error) {
        console.error('Auth middleware error:', error.message)
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.'
            })
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            })
        }
        
        return res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        })
    }
}

// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        })
    }
}

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.authToken
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded.userId).select('-password')
            if (user) {
                req.user = user
            }
        }
        next()
    } catch (error) {
        // Continue without authentication
        next()
    }
}

module.exports = {
    authMiddleware,
    adminMiddleware,
    optionalAuth
}

