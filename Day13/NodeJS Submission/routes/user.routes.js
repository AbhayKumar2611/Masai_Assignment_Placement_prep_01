const express = require('express')
const router = express.Router()
const {
    registerUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser
} = require('../controllers/user.controller')
const {
    validateUserRegistration,
    sanitizeInput
} = require('../middleware/validation.middleware')

/**
 * User Routes
 * 
 * All routes are prefixed with /api/users
 */

// Register user (with validation middleware)
router.post('/register', sanitizeInput, validateUserRegistration, registerUser)

// Get all users
router.get('/', getAllUsers)

// Get user by ID
router.get('/:id', getUserById)

// Update user
router.put('/:id', updateUser)

// Delete user
router.delete('/:id', deleteUser)

module.exports = router

