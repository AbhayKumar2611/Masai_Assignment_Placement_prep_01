const { ValidationError } = require('../errors/CustomErrors')

/**
 * Custom Validation Middleware
 * Validates user registration input (email, password strength, age)
 */

/**
 * Email Validation
 */
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || typeof email !== 'string') {
        return { valid: false, message: 'Email is required and must be a string' }
    }
    if (!emailRegex.test(email)) {
        return { valid: false, message: 'Invalid email format' }
    }
    return { valid: true }
}

/**
 * Password Strength Validation
 * Requirements:
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 */
const validatePassword = (password) => {
    const errors = []

    if (!password || typeof password !== 'string') {
        return { valid: false, errors: ['Password is required and must be a string'] }
    }

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long')
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter')
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter')
    }
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number')
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)')
    }

    if (errors.length > 0) {
        return { valid: false, errors }
    }

    return { valid: true }
}

/**
 * Age Validation
 */
const validateAge = (age) => {
    if (age === undefined || age === null) {
        return { valid: false, message: 'Age is required' }
    }

    const ageNum = parseInt(age, 10)

    if (isNaN(ageNum)) {
        return { valid: false, message: 'Age must be a number' }
    }

    if (ageNum < 18) {
        return { valid: false, message: 'Age must be at least 18' }
    }

    if (ageNum > 120) {
        return { valid: false, message: 'Age must be less than or equal to 120' }
    }

    return { valid: true }
}

/**
 * User Registration Validation Middleware
 * Validates email, password strength, and age
 */
const validateUserRegistration = (req, res, next) => {
    const { email, password, age } = req.body
    const validationErrors = []

    // Validate email
    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
        validationErrors.push({
            field: 'email',
            message: emailValidation.message
        })
    }

    // Validate password
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
        passwordValidation.errors.forEach(error => {
            validationErrors.push({
                field: 'password',
                message: error
            })
        })
    }

    // Validate age
    const ageValidation = validateAge(age)
    if (!ageValidation.valid) {
        validationErrors.push({
            field: 'age',
            message: ageValidation.message
        })
    }

    // If validation errors exist, throw ValidationError
    if (validationErrors.length > 0) {
        return next(new ValidationError('Validation failed', validationErrors))
    }

    // Validation passed, proceed to next middleware
    next()
}

/**
 * Sanitize Input Middleware
 * Removes whitespace and potentially dangerous characters
 */
const sanitizeInput = (req, res, next) => {
    if (req.body) {
        // Trim string fields
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim()
            }
        })

        // Convert email to lowercase
        if (req.body.email) {
            req.body.email = req.body.email.toLowerCase().trim()
        }
    }

    next()
}

module.exports = {
    validateUserRegistration,
    validateEmail,
    validatePassword,
    validateAge,
    sanitizeInput
}

