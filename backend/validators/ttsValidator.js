import { body } from 'express-validator';

export const validateTTSRequest = [
  body('text').notEmpty().withMessage('Text string to synthesize is required').isString(),
  body('language').optional().isIn(['Tamil', 'Hindi', 'Telugu', 'Malayalam', 'Kannada', 'English', 'tamil', 'hindi', 'telugu', 'malayalam', 'kannada', 'english']),
  body('voiceStyle').optional().isIn(['teacher', 'cheerful', 'neutral', 'expressive']),
  body('speed').optional().isFloat({ min: 0.5, max: 2.0 })
];

export default {
  validateTTSRequest
};
