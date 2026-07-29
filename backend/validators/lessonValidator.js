import { body, param, query } from 'express-validator';
import { validate } from './authValidator.js';

export const createLessonValidation = [
    body('language').trim().notEmpty().withMessage('Language is required').toLowerCase()
        .isIn(['tamil', 'telugu', 'hindi', 'kannada', 'malayalam', 'english']).withMessage('Unsupported language'),
    body('level').trim().notEmpty().withMessage('Level is required').toLowerCase()
        .isIn(['beginner', 'intermediate', 'advanced', 'expert', 'alphabets', 'vowels', 'consonants', 'words', 'sentences']).withMessage('Invalid level'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('xpReward').optional().isInt({ min: 0 }).withMessage('xpReward must be a positive integer'),
    body('diamondReward').optional().isInt({ min: 0 }).withMessage('diamondReward must be a positive integer'),
    validate
];

export const updateLessonValidation = [
    param('id').notEmpty().withMessage('Lesson ID is required'),
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('xpReward').optional().isInt({ min: 0 }),
    body('diamondReward').optional().isInt({ min: 0 }),
    validate
];
