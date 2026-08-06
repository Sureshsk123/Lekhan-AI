import { body, validationResult } from 'express-validator';

// ─── Validation Error Handler ─────────────────────────────────────────────────
// Returns 422 Unprocessable Entity with a structured errors array.
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed. Please check your input.',
            errors: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg
            }))
        });
    }
    next();
};

// ─── Registration Validation Rules ────────────────────────────────────────────
export const registerValidationRules = [
    (req, res, next) => {
        if (!req.body.username && req.body.fullName) {
            req.body.username = req.body.fullName.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase().slice(0, 20) + '_' + Math.floor(Math.random() * 1000);
        }
        next();
    },

    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters long')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers and underscores'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .isLength({ max: 128 }).withMessage('Password must not exceed 128 characters'),

    body('phone')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .matches(/^\+?[\d\s\-().]{7,20}$/).withMessage('Please provide a valid phone number (7–20 digits)'),

    body('gender')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isIn(['male', 'female', 'other']).withMessage('Gender must be one of: male, female, other'),

    body('avatar')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isString().withMessage('Avatar must be a string')
        .isLength({ max: 255 }).withMessage('Avatar path too long'),

    body('mode')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isIn(['student', 'parent']).withMessage('Mode must be one of: student, parent'),

    body('enrolledLanguages')
        .optional({ nullable: true })
        .isArray().withMessage('Enrolled languages must be an array')
];

// ─── Login Validation Rules ────────────────────────────────────────────────────
export const loginValidationRules = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ max: 128 }).withMessage('Password exceeds maximum allowed length')
];
