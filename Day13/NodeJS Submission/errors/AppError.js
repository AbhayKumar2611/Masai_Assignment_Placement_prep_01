/**
 * Base Application Error Class
 * Extends native Error class with status code and operational flag
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOperational = true // Mark as operational error (trusted)

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError

