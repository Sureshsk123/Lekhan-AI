import { body } from 'express-validator';
import { validate } from './authValidator.js';

export const updateLessonProgressValidation = [
    body('language').trim().notEmpty().withMessage('Language is required'),
    body('lessonId').notEmpty().withMessage('Lesson ID is required'),
    validate
];

export const updateWordProgressValidation = [
    body('language').trim().notEmpty().withMessage('Language is required'),
    body('word').trim().notEmpty().withMessage('Word is required'),
    validate
];
