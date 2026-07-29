import { body, query } from 'express-validator';

export const evaluateHandwritingValidation = [
  body('targetChar').optional().isString().trim(),
  body('language').optional().isString(),
  body('inputType').optional().isIn(['canvas', 'upload'])
];

export const handwritingHistoryValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

export default {
  evaluateHandwritingValidation,
  handwritingHistoryValidation
};
