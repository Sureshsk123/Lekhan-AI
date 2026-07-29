import { body, param, query } from 'express-validator';

export const validateRoleUpdate = [
  param('userId').isMongoId().withMessage('Invalid target userId format'),
  body('role').notEmpty().isIn(['user', 'admin', 'parent']).withMessage('Role must be user, admin, or parent')
];

export const validateAdminUserQuery = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['user', 'admin', 'parent']),
  query('search').optional().isString()
];

export default {
  validateRoleUpdate,
  validateAdminUserQuery
};
