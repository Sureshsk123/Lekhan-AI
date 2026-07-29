import express from 'express';
import {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser
} from '../controllers/authController.js';
import { registerValidationRules, loginValidationRules, validate } from '../validators/authValidator.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Re-export protect for backwards compatibility with non-auth routes importing from './auth.js'
export { protect };

// @route   POST /api/auth/signup
// @route   POST /api/auth/register
// @desc    Register a new user in MongoDB Atlas
// @access  Public
router.post('/signup', registerValidationRules, validate, registerUser);
router.post('/register', registerValidationRules, validate, registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token from MongoDB Atlas
// @access  Public
router.post('/login', loginValidationRules, validate, loginUser);

// @route   GET /api/auth/profile
// @route   GET /api/auth/me
// @desc    Get current user profile from MongoDB Atlas
// @access  Private
router.get('/profile', protect, getUserProfile);
router.get('/me', protect, getUserProfile);

// @route   POST /api/auth/logout
// @desc    Logout current user (stateless — client must discard token)
// @access  Private
router.post('/logout', protect, logoutUser);

export default router;
