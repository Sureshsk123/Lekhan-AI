import { body, param } from 'express-validator';
import { validate } from './authValidator.js';

export const generateQuizValidation = [
    param('lessonId').notEmpty().withMessage('Lesson ID is required'),
    validate
];

export const submitQuizValidation = [
    body('score').isInt({ min: 0 }).withMessage('Score must be a non-negative integer'),
    body('totalQuestions').isInt({ min: 1 }).withMessage('totalQuestions must be at least 1'),
    validate
];
