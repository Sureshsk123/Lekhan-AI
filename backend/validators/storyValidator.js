import { body, param } from 'express-validator';
import { validate } from './authValidator.js';

export const createStoryValidation = [
    body('language').trim().notEmpty().withMessage('Language is required').toLowerCase()
        .isIn(['tamil', 'telugu', 'hindi', 'kannada', 'malayalam', 'english']).withMessage('Unsupported language'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    validate
];

export const updateStoryValidation = [
    param('id').notEmpty().withMessage('Story ID is required'),
    validate
];
