/**
 * Standardized REST API Response Formatter
 * 
 * Success Format:
 * {
 *   success: true,
 *   message: "...",
 *   data: { ... }
 * }
 * 
 * Failure Format:
 * {
 *   success: false,
 *   message: "...",
 *   errors: [ { field: "...", message: "..." } ]
 * }
 */

export const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}, extra = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        errors: [],
        ...extra
    });
};

export const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = []) => {
    const formattedErrors = Array.isArray(errors)
        ? errors.map(err => typeof err === 'string' ? { message: err } : err)
        : [{ message: String(errors) }];

    return res.status(statusCode).json({
        success: false,
        message,
        errors: formattedErrors
    });
};
