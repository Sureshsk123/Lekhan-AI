import { body, query } from 'express-validator';

export const validateVisionOCR = [
  body('language').optional().isString(),
  body('fileType').optional().isIn(['png', 'jpg', 'jpeg', 'pdf', 'image/png', 'image/jpeg', 'application/pdf']),
  body('imageBase64').optional().isString()
];

export const validateOCRHistoryQuery = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString()
];

export default {
  validateVisionOCR,
  validateOCRHistoryQuery
};
