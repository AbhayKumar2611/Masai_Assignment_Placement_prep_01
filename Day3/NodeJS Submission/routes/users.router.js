const express = require('express')
const {
    signup,
    login,
    getProfile,
    getUserFromToken,
    refreshToken,
    updateProfile,
    getAllUsers,
    verifyToken
} = require('../controllers/user.controller')
const { jwtAuthMiddleware, adminAuthMiddleware } = require('../middleware/jwt.middleware')

const UserRouter = express.Router()

// ============================================
// Public Routes (No Authentication Required)
// ============================================

// Signup endpoint - generates JWT token
UserRouter.post('/signup', signup)

// Login endpoint - generates JWT token
UserRouter.post('/login', login)

// ============================================
// Protected Routes (JWT Authentication Required)
// ============================================

// Get current user profile
UserRouter.get('/profile', jwtAuthMiddleware, getProfile)

// Update current user profile
UserRouter.put('/profile', jwtAuthMiddleware, updateProfile)

// Get user info extracted from JWT token
UserRouter.get('/me', jwtAuthMiddleware, getUserFromToken)

// Refresh JWT token (generates new token)
UserRouter.post('/refresh', jwtAuthMiddleware, refreshToken)

// Verify if JWT token is valid
UserRouter.get('/verify', jwtAuthMiddleware, verifyToken)

// ============================================
// Admin Only Routes (JWT + Admin Role Required)
// ============================================

// Get all users (admin only)
UserRouter.get('/all', jwtAuthMiddleware, adminAuthMiddleware, getAllUsers)

module.exports = UserRouter
