import { body } from 'express-validator';
import { validate } from './authValidator.js';

export const updateUserProfileValidation = [
    body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('avatar').optional().trim(),
    body('enrolledLanguages').optional().isArray().withMessage('enrolledLanguages must be an array'),
    validate
];

export const updateXPValidation = [
    body('amount').isInt().withMessage('Amount must be an integer'),
    validate
];

export const updateDiamondsValidation = [
    body('amount').isInt().withMessage('Amount must be an integer'),
    validate
];
