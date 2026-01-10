const User = require('../models/user.model')
const { catchAsync } = require('../middleware/errorHandler')
const { NotFoundError, ConflictError } = require('../errors/CustomErrors')

/**
 * Register User
 * POST /api/users/register
 * 
 * Uses validation middleware before reaching this controller
 */
const registerUser = catchAsync(async (req, res, next) => {
    const { email, password, age, name } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return next(new ConflictError('User with this email already exists'))
    }

    // Create new user
    const user = await User.create({
        email,
        password, // In production, hash password before saving
        age,
        name
    })

    // Remove password from response
    user.password = undefined

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
            user
        }
    })
})

/**
 * Get User by ID
 * GET /api/users/:id
 */
const getUserById = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).select('-password')

    if (!user) {
        return next(new NotFoundError('User not found'))
    }

    res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: {
            user
        }
    })
})

/**
 * Get All Users
 * GET /api/users
 */
const getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find().select('-password').sort({ createdAt: -1 })

    res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: {
            users,
            count: users.length
        }
    })
})

/**
 * Update User
 * PUT /api/users/:id
 */
const updateUser = catchAsync(async (req, res, next) => {
    const { name, age } = req.body
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { name, age },
        {
            new: true,
            runValidators: true
        }
    ).select('-password')

    if (!user) {
        return next(new NotFoundError('User not found'))
    }

    res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: {
            user
        }
    })
})

/**
 * Delete User
 * DELETE /api/users/:id
 */
const deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
        return next(new NotFoundError('User not found'))
    }

    res.status(200).json({
        success: true,
        message: 'User deleted successfully'
    })
})

module.exports = {
    registerUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser
}

