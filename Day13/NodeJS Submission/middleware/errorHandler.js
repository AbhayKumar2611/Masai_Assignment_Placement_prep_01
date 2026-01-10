const AppError = require('../errors/AppError')

/**
 * Centralized Error Handler Middleware
 * Formats errors consistently and sends appropriate responses
 */

/**
 * Development Error Response
 * Includes stack trace and detailed error information
 */
const sendErrorDev = (err, res) => {
    const response = {
        success: false,
        status: err.status || 'error',
        error: err,
        message: err.message,
        stack: err.stack
    }
    
    // Include validation errors array if present
    if (err.errors && Array.isArray(err.errors)) {
        response.errors = err.errors
    }
    
    res.status(err.statusCode || 500).json(response)
}

/**
 * Production Error Response
 * Sends sanitized error messages (no stack traces, limited details)
 */
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode || 500).json({
            success: false,
            status: err.status || 'error',
            message: err.message,
            ...(err.errors && { errors: err.errors }) // Include validation errors if present
        })
    } else {
        // Programming or unknown error: don't leak error details
        console.error('ERROR 💥', err)
        
        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Something went wrong!'
        })
    }
}

/**
 * Handle Cast Errors (Invalid ObjectId)
 */
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`
    return new AppError(message, 400)
}

/**
 * Handle Duplicate Field Errors
 */
const handleDuplicateFieldsDB = (err) => {
    // Mongoose duplicate key error
    let message = 'Duplicate field value. Please use another value!'
    
    // Try to extract field and value from error
    if (err.keyValue) {
        const field = Object.keys(err.keyValue)[0]
        const value = err.keyValue[field]
        message = `Duplicate field value for ${field}: ${value}. Please use another value!`
    } else if (err.errmsg) {
        // Fallback for older MongoDB errors
        const match = err.errmsg.match(/(["'])(\\?.)*?\1/)
        if (match) {
            message = `Duplicate field value: ${match[0]}. Please use another value!`
        }
    }
    
    return new AppError(message, 409)
}

/**
 * Handle Validation Errors (Mongoose validation errors or custom ValidationError)
 */
const handleValidationErrorDB = (err) => {
    // If it's already a custom ValidationError with errors array, preserve it
    if (err.errors && Array.isArray(err.errors)) {
        const error = new AppError(err.message || 'Validation failed', 422)
        error.errors = err.errors
        error.isOperational = true
        return error
    }
    
    // Handle Mongoose ValidationError
    const errors = Object.values(err.errors || {}).map(el => ({
        field: el.path,
        message: el.message
    }))
    
    const message = errors.length > 0 ? 'Invalid input data' : 'Validation failed'
    const error = new AppError(message, 422)
    error.errors = errors
    error.isOperational = true
    return error
}

/**
 * Handle JWT Errors
 */
const handleJWTError = () => {
    return new AppError('Invalid token. Please log in again!', 401)
}

/**
 * Handle JWT Expired Errors
 */
const handleJWTExpiredError = () => {
    return new AppError('Your token has expired! Please log in again.', 401)
}

/**
 * Main Error Handler Middleware
 * Must be used after all routes
 */
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    // Handle specific error types (both dev and prod)
    if (err.name === 'CastError') {
        err = handleCastErrorDB(err)
    }
    if (err.code === 11000 || err.name === 'MongoServerError') {
        err = handleDuplicateFieldsDB(err)
    }
    if (err.name === 'ValidationError' || err.name === 'MongooseValidationError') {
        err = handleValidationErrorDB(err)
    }
    if (err.name === 'JsonWebTokenError') {
        err = handleJWTError()
    }
    if (err.name === 'TokenExpiredError') {
        err = handleJWTExpiredError()
    }

    // Preserve errors array for custom ValidationError (if exists)
    if (err.errors && Array.isArray(err.errors)) {
        err.isOperational = true // Mark as operational
    }

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else {
        sendErrorProd(err, res)
    }
}

/**
 * Async Error Handler Wrapper
 * Catches errors in async route handlers and passes to error handler
 */
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }
}

/**
 * Handle Unhandled Promise Rejections
 * Should be called at the process level
 */
const handleUnhandledRejections = () => {
    process.on('unhandledRejection', (reason, promise) => {
        console.log('UNHANDLED REJECTION! 💥 Shutting down...')
        console.log(reason.name, reason.message)
        
        // Close server gracefully
        process.exit(1)
    })
}

/**
 * Handle Uncaught Exceptions
 * Should be called at the process level
 */
const handleUncaughtExceptions = () => {
    process.on('uncaughtException', (err) => {
        console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...')
        console.log(err.name, err.message)
        
        // Close server gracefully
        process.exit(1)
    })
}

module.exports = {
    errorHandler,
    catchAsync,
    handleUnhandledRejections,
    handleUncaughtExceptions
}

