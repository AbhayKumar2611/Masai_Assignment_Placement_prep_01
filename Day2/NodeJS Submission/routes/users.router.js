const express = require('express')
const {
    signup,
    login,
    logout,
    getProfile,
    getAllUsers,
    updateProfile
} = require('../controllers/user.controller')
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

const UserRouter = express.Router()

// Public routes
UserRouter.post('/signup', signup)
UserRouter.post('/login', login)

// Protected routes (require authentication)
UserRouter.post('/logout', authMiddleware, logout)
UserRouter.get('/profile', authMiddleware, getProfile)
UserRouter.put('/profile', authMiddleware, updateProfile)

// Admin only routes
UserRouter.get('/all', authMiddleware, adminMiddleware, getAllUsers)

module.exports = UserRouter
