import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  achievementId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['general', 'milestone', 'language', 'daily', 'weekly', 'hidden'],
    default: 'general'
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'all'
  },
  xpReward: {
    type: Number,
    default: 100
  },
  diamondReward: {
    type: Number,
    default: 10
  },
  targetMetric: {
    type: String,
    default: 'xp'
  },
  targetValue: {
    type: Number,
    default: 100
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Achievement', achievementSchema);
