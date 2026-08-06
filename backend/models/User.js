import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    trim: true,
    sparse: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'parent'],
    default: 'user',
    lowercase: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other',
    lowercase: true
  },
  avatar: {
    type: String,
    default: 'avatar1.png'
  },
  mode: {
    type: String,
    enum: ['student', 'parent'],
    default: 'student',
    lowercase: true
  },
  preferredLanguage: {
    type: String,
    enum: ['tamil', 'telugu', 'hindi', 'kannada', 'malayalam', 'english', 'ta', 'te', 'hi', 'kn', 'ml', 'en'],
    default: 'tamil',
    lowercase: true
  },
  enrolledLanguages: [{
    type: String,
    enum: ['tamil', 'telugu', 'hindi', 'kannada', 'malayalam', 'english', 'ta', 'te', 'hi', 'kn', 'ml', 'en'],
    lowercase: true
  }],
  activeTheme: {
    type: String,
    default: 'theme_default'
  },
  activeTitle: {
    type: String,
    default: 'Beginner'
  },
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  diamonds: {
    type: Number,
    default: 100,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastLoginDate: { type: Date, default: null }
  },
  achievements: [{
    id: String,
    name: String,
    icon: String,
    description: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  inventory: [{
    itemId: String,
    itemType: String,
    purchasedAt: { type: Date, default: Date.now }
  }],
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

userSchema.index({ phone: 1 }, { unique: true, sparse: true, name: 'phone_unique_sparse' });
userSchema.index({ createdAt: -1 });
userSchema.index({ updatedAt: -1 });
userSchema.index({ xp: -1 });
userSchema.index({ isDeleted: 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.updateStreak = async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!this.streak.lastLoginDate) {
    this.streak.current = 1;
    this.streak.longest = 1;
    this.streak.lastLoginDate = today;
  } else {
    const lastLogin = new Date(this.streak.lastLoginDate);
    lastLogin.setHours(0, 0, 0, 0);

    const diffTime = today - lastLogin;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      this.streak.current += 1;
      if (this.streak.current > this.streak.longest) {
        this.streak.longest = this.streak.current;
      }
      this.streak.lastLoginDate = today;
    } else if (diffDays > 1) {
      this.streak.current = 1;
      this.streak.lastLoginDate = today;
    }
  }

  return this.save();
};

export default mongoose.model('User', userSchema);
