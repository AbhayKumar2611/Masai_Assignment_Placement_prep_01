const jwt = require('jsonwebtoken')
const User = require('../models/user.models')

// Middleware to verify JWT token from Authorization header
const jwtAuthMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        // Expected format: "Bearer <token>"
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided. Please login first.',
                hint: 'Include token in Authorization header as: Bearer <token>'
            })
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token format. Use: Bearer <token>'
            })
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        console.log('✅ Token verified for user:', decoded.userId)
        
        // Get user from database (excluding password)
        const user = await User.findById(decoded.userId).select('-password')
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Token is invalid.'
            })
        }

        // Attach user and token info to request object
        req.user = user
        req.userId = decoded.userId
        req.tokenIssuedAt = new Date(decoded.iat * 1000)
        req.tokenExpiresAt = new Date(decoded.exp * 1000)
        
        next()
    } catch (error) {
        console.error('JWT Auth Error:', error.message)
        
        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.',
                error: error.message
            })
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please login again.',
                expiredAt: error.expiredAt
            })
        }
        
        return res.status(500).json({
            success: false,
            message: 'Server error during authentication',
            error: error.message
        })
    }
}

// Middleware to check if user is admin
const adminAuthMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.',
            currentRole: req.user ? req.user.role : 'none'
        })
    }
}

// Optional auth middleware (doesn't block request if no token)
const optionalJwtAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded.userId).select('-password')
            
            if (user) {
                req.user = user
                req.userId = decoded.userId
            }
        }
        next()
    } catch (error) {
        // Continue without authentication
        next()
    }
}

module.exports = {
    jwtAuthMiddleware,
    adminAuthMiddleware,
    optionalJwtAuth
}

