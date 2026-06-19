/**
 * Standardized API Response Handler
 * Ensures all API responses follow a consistent format
 */

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, data, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {string} error - Error message
 * @param {number} statusCode - HTTP status code (default: 400)
 * @param {*} details - Additional error details (default: null)
 */
export const sendError = (res, error, statusCode = 400, details = null) => {
  return res.status(statusCode).json({
    success: false,
    error,
    details
  });
};

/**
 * Send a validation error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {*} details - Validation error details
 */
export const sendValidationError = (res, message, details = null) => {
  return res.status(422).json({
    success: false,
    error: message || 'Validation failed',
    details
  });
};

/**
 * Send an unauthorized response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const sendUnauthorized = (res, message = 'Unauthorized') => {
  return res.status(401).json({
    success: false,
    error: message,
    details: null
  });
};

/**
 * Send a forbidden response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const sendForbidden = (res, message = 'Forbidden') => {
  return res.status(403).json({
    success: false,
    error: message,
    details: null
  });
};

/**
 * Send a not found response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 */
export const sendNotFound = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    error: message,
    details: null
  });
};

/**
 * Send an internal server error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {*} details - Error details (optional)
 */
export const sendServerError = (res, message = 'Internal server error', details = null) => {
  return res.status(500).json({
    success: false,
    error: message,
    details
  });
};
