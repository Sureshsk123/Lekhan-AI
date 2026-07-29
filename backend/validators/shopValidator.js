import { body } from 'express-validator';
import { validate } from './authValidator.js';

export const purchaseItemValidation = [
    body('itemId').trim().notEmpty().withMessage('itemId is required'),
    validate
];

export const equipItemValidation = [
    body('itemId').trim().notEmpty().withMessage('itemId is required'),
    validate
];
