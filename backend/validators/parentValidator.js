import { body } from 'express-validator';

export const validateLinkChild = [
  body('childEmail').notEmpty().withMessage('Child email address is required').isEmail(),
  body('relationship').optional().isIn(['parent', 'guardian', 'tutor'])
];

export default {
  validateLinkChild
};
