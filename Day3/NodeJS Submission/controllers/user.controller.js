const User = require('../models/user.models')
const jwt = require('jsonwebtoken')

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '24h' }
    )
}

// @desc    Register a new user (Signup)
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
            role: role || 'user'
        })

        // Generate JWT token
        const token = generateToken(user._id)
        
        // Decode token to get expiration info
        const decoded = jwt.decode(token)
        const expiresAt = new Date(decoded.exp * 1000)

        console.log('✅ User registered:', user.username)

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt
                },
                token: token,
                tokenType: 'Bearer',
                expiresIn: process.env.JWT_EXPIRE || '24h',
                expiresAt: expiresAt
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

        // Generate JWT token
        const token = generateToken(user._id)
        
        // Decode token to get expiration info
        const decoded = jwt.decode(token)
        const expiresAt = new Date(decoded.exp * 1000)

        console.log('✅ User logged in:', user.username)

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
                token: token,
                tokenType: 'Bearer',
                expiresIn: process.env.JWT_EXPIRE || '24h',
                expiresAt: expiresAt,
                usage: 'Include in Authorization header as: Bearer <token>'
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

// @desc    Get current user profile (Protected)
// @route   GET /users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: {
                user: req.user,
                tokenInfo: {
                    issuedAt: req.tokenIssuedAt,
                    expiresAt: req.tokenExpiresAt,
                    timeRemaining: Math.floor((req.tokenExpiresAt - new Date()) / 1000) + ' seconds'
                }
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

// @desc    Get user info from JWT (demonstrates JWT extraction)
// @route   GET /users/me
// @access  Private
const getUserFromToken = async (req, res) => {
    try {
        // User info extracted from JWT by middleware
        res.status(200).json({
            success: true,
            message: 'User info extracted from JWT token',
            data: {
                extractedFrom: 'JWT Authorization Header',
                userId: req.userId,
                user: {
                    id: req.user._id,
                    username: req.user.username,
                    email: req.user.email,
                    role: req.user.role,
                    createdAt: req.user.createdAt,
                    updatedAt: req.user.updatedAt
                },
                tokenMetadata: {
                    issuedAt: req.tokenIssuedAt,
                    expiresAt: req.tokenExpiresAt,
                    isValid: new Date() < req.tokenExpiresAt,
                    secondsUntilExpiry: Math.floor((req.tokenExpiresAt - new Date()) / 1000)
                }
            }
        })
    } catch (error) {
        console.error('Get user from token error:', error)
        res.status(500).json({
            success: false,
            message: 'Error extracting user info',
            error: error.message
        })
    }
}

// @desc    Refresh token (generates new token)
// @route   POST /users/refresh
// @access  Private
const refreshToken = async (req, res) => {
    try {
        // Generate new token
        const newToken = generateToken(req.user._id)
        const decoded = jwt.decode(newToken)
        const expiresAt = new Date(decoded.exp * 1000)

        console.log('🔄 Token refreshed for user:', req.user.username)

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                token: newToken,
                tokenType: 'Bearer',
                expiresIn: process.env.JWT_EXPIRE || '24h',
                expiresAt: expiresAt,
                oldTokenExpiry: req.tokenExpiresAt
            }
        })
    } catch (error) {
        console.error('Refresh token error:', error)
        res.status(500).json({
            success: false,
            message: 'Error refreshing token',
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

        console.log('✏️ Profile updated:', user.username)

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    updatedAt: user.updatedAt
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
                users: users
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

// @desc    Verify token validity
// @route   GET /users/verify
// @access  Private
const verifyToken = async (req, res) => {
    try {
        const timeUntilExpiry = Math.floor((req.tokenExpiresAt - new Date()) / 1000)
        const isExpiringSoon = timeUntilExpiry < 300 // Less than 5 minutes

        res.status(200).json({
            success: true,
            message: 'Token is valid',
            data: {
                valid: true,
                user: {
                    id: req.user._id,
                    username: req.user.username,
                    email: req.user.email
                },
                tokenInfo: {
                    issuedAt: req.tokenIssuedAt,
                    expiresAt: req.tokenExpiresAt,
                    secondsRemaining: timeUntilExpiry,
                    isExpiringSoon: isExpiringSoon,
                    recommendation: isExpiringSoon ? 'Consider refreshing your token' : 'Token is valid'
                }
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error verifying token',
            error: error.message
        })
    }
}

module.exports = {
    signup,
    login,
    getProfile,
    getUserFromToken,
    refreshToken,
    updateProfile,
    getAllUsers,
    verifyToken
}

