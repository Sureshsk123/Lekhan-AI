import { body, param, query } from 'express-validator';

export const validateChatQuery = [
  body('message').notEmpty().withMessage('Message prompt is required').isString(),
  body('sessionId').optional().isMongoId().withMessage('Invalid sessionId format'),
  body('language').optional().isString(),
  body('ageGroup').optional().isIn(['kids', 'teen', 'adult']),
  body('difficulty').optional().isIn(['Easy', 'Medium', 'Hard', 'Advanced'])
];

export const validateSessionId = [
  param('sessionId').isMongoId().withMessage('Invalid sessionId format')
];

export default {
  validateChatQuery,
  validateSessionId
};
