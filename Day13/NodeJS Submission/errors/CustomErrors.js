const AppError = require('./AppError')

/**
 * Custom Error Classes for different error types
 */

/**
 * Bad Request Error (400)
 * Used for invalid input, validation errors
 */
class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, 400)
        this.name = 'BadRequestError'
    }
}

/**
 * Unauthorized Error (401)
 * Used when authentication is required or failed
 */
class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401)
        this.name = 'UnauthorizedError'
    }
}

/**
 * Forbidden Error (403)
 * Used when user doesn't have permission
 */
class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403)
        this.name = 'ForbiddenError'
    }
}

/**
 * Not Found Error (404)
 * Used when resource doesn't exist
 */
class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404)
        this.name = 'NotFoundError'
    }
}

/**
 * Conflict Error (409)
 * Used for duplicate resources, conflicts
 */
class ConflictError extends AppError {
    constructor(message = 'Resource conflict') {
        super(message, 409)
        this.name = 'ConflictError'
    }
}

/**
 * Validation Error (422)
 * Used for validation failures
 */
class ValidationError extends AppError {
    constructor(message = 'Validation failed', errors = []) {
        super(message, 422)
        this.name = 'ValidationError'
        this.errors = errors // Array of validation error details
    }
}

/**
 * Internal Server Error (500)
 * Used for unexpected server errors
 */
class InternalServerError extends AppError {
    constructor(message = 'Internal Server Error') {
        super(message, 500)
        this.name = 'InternalServerError'
    }
}

module.exports = {
    AppError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    ValidationError,
    InternalServerError
}

