const User = require('../models/user.models')
const jwt = require('jsonwebtoken')

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    )
}

// @desc    Register a new user
// @route   POST /users/signup
// @access  Public
const signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username, email, and password'
            })
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email
                    ? 'Email already registered'
                    : 'Username already taken'
            })
        }

        // Create new user
        const user = await User.create({
            username,
            email,
            password,
            role: role || 'user' // Default to 'user' if not specified
        })

        // Generate token
        const token = generateToken(user._id)

        // Set cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'strict'
        })

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            }
        })
    } catch (error) {
        console.error('Signup error:', error)
        res.status(500).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        })
    }
}

// @desc    Login user
// @route   POST /users/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            })
        }

        // Find user by email
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password)

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // Generate token
        const token = generateToken(user._id)

        // Set cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            sameSite: 'strict'
        })

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            }
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        })
    }
}

// @desc    Logout user
// @route   POST /users/logout
// @access  Private
const logout = async (req, res) => {
    try {
        // Clear cookie
        res.clearCookie('authToken')

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        })
    } catch (error) {
        console.error('Logout error:', error)
        res.status(500).json({
            success: false,
            message: 'Error during logout',
            error: error.message
        })
    }
}

// @desc    Get current user profile
// @route   GET /users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: {
                user: req.user
            }
        })
    } catch (error) {
        console.error('Get profile error:', error)
        res.status(500).json({
            success: false,
            message: 'Error retrieving profile',
            error: error.message
        })
    }
}

// @desc    Get all users (Admin only)
// @route   GET /users/all
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: {
                count: users.length,
                users
            }
        })
    } catch (error) {
        console.error('Get all users error:', error)
        res.status(500).json({
            success: false,
            message: 'Error retrieving users',
            error: error.message
        })
    }
}

// @desc    Update user profile
// @route   PUT /users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body

        const user = await User.findById(req.user._id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // Update fields if provided
        if (username) user.username = username
        if (email) user.email = email

        await user.save()

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        })
    } catch (error) {
        console.error('Update profile error:', error)
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        })
    }
}

module.exports = {
    signup,
    login,
    logout,
    getProfile,
    getAllUsers,
    updateProfile
}

