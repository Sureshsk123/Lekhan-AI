import { body, query } from 'express-validator';

export const validateSTTUpload = [
  body('language').optional().isString(),
  body('expectedText').optional().isString(),
  body('audioBase64').optional().isString()
];

export const validateSTTHistoryQuery = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

export default {
  validateSTTUpload,
  validateSTTHistoryQuery
};
