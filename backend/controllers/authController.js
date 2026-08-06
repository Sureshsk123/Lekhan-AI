import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ─── Helper: Generate JWT Token ────────────────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'langsphere_jwt_secret_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// ─── Helper: Safe User Projection ─────────────────────────────────────────────
const safeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  phone: user.phone || null,
  role: user.role || 'user',
  gender: user.gender,
  avatar: user.avatar,
  mode: user.mode,
  preferredLanguage: user.preferredLanguage || user.enrolledLanguages?.[0] || 'tamil',
  enrolledLanguages: user.enrolledLanguages || [user.preferredLanguage || 'tamil'],
  xp: user.xp,
  diamonds: user.diamonds,
  level: user.level,
  streak: user.streak,
  createdAt: user.createdAt
});

// @desc    Register a new user in MongoDB Atlas
// @route   POST /api/auth/signup  |  POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { username, email, phone, password, role, gender, avatar, mode, enrolledLanguages, preferredLanguage, language } = req.body;

    const chosenLang = (preferredLanguage || language || enrolledLanguages?.[0] || 'tamil').toLowerCase();

    // Check for duplicate email or username in MongoDB
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.trim() }
      ]
    });

    if (existingUser) {
      const isEmailDuplicate = existingUser.email === email.toLowerCase();
      return res.status(409).json({
        success: false,
        message: isEmailDuplicate
          ? 'User already exists with this email address'
          : 'User already exists with this username',
        errors: [
          {
            field: isEmailDuplicate ? 'email' : 'username',
            message: isEmailDuplicate
              ? 'This email address is already registered'
              : 'This username is already taken'
          }
        ]
      });
    }

    // Create new user in MongoDB (pre-save hook will hash the password)
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      phone: phone ? String(phone).trim() : undefined,  // guard against undefined.trim() crash
      password,
      role: role || 'user',
      gender: gender ? gender.toLowerCase() : 'other',
      avatar: avatar || 'avatar1.png',
      mode: mode ? mode.toLowerCase() : 'student',
      preferredLanguage: chosenLang,
      enrolledLanguages: enrolledLanguages ? enrolledLanguages.map(l => l.toLowerCase()) : [chosenLang],
      xp: 0,
      diamonds: 100,
      level: 1,
      streak: { current: 0, longest: 0, lastLoginDate: null },
      achievements: [],
      inventory: [],
      children: [],
      parent: null
    });

    // Generate JWT token
    const token = generateToken(user._id);

    console.log(`✅ Register Success: ${user.email} (ID: ${user._id})`);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: safeUser(user)
      }
    });
  } catch (error) {
    console.error(`❌ Register Failed: ${error.message}`);

    // Handle Mongoose duplicate key error (race condition)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0] || 'field';
      return res.status(409).json({
        success: false,
        message: `Duplicate value for ${field}`,
        errors: [{ field, message: `A user with this ${field} already exists` }]
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal Server Error during registration',
      errors: [{ field: 'server', message: error.message }]
    });
  }
};

// @desc    Authenticate user & get JWT token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in MongoDB (explicitly include +password for comparison)
    const user = await User.findOne({ email: email.toLowerCase(), isDeleted: false }).select('+password');

    if (!user) {
      console.warn(`⚠️ Login Failed: No user found for email ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: [{ field: 'email', message: 'No active account found with this email address' }]
      });
    }

    // Compare entered password with hashed password in MongoDB
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn(`⚠️ Login Failed: Invalid password for ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: [{ field: 'password', message: 'Incorrect password' }]
      });
    }

    // Update streak on login
    await user.updateStreak();

    // Generate JWT token
    const token = generateToken(user._id);

    console.log(`✅ Login Success: ${user.email} (ID: ${user._id})`);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: safeUser(user)
      }
    });
  } catch (error) {
    console.error(`❌ Login Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error during login',
      errors: [{ field: 'server', message: error.message }]
    });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/profile
// @access  Private (JWT Protect)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user || user.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
        errors: [{ field: 'user', message: 'User does not exist or has been deleted' }]
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: { user: safeUser(user) }
    });
  } catch (error) {
    console.error(`❌ Get Profile Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
      errors: [{ field: 'server', message: error.message }]
    });
  }
};

export const getUserProfile = getProfile;

// @desc    Logout user (stateless JWT cleanup)
// @route   POST /api/auth/logout
// @access  Private (JWT Protect)
export const logoutUser = async (req, res) => {
  try {
    console.log(`✅ Logout: User ${req.user._id} logged out`);
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error logging out',
      errors: [{ field: 'server', message: error.message }]
    });
  }
};

export default {
  registerUser,
  loginUser,
  getProfile,
  getUserProfile,
  logoutUser
};
