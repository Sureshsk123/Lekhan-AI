import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    enum: ['info', 'warning', 'achievement', 'reward', 'streak', 'practice_reminder', 'leaderboard', 'parent_reminder']
  },
  read: {
    type: Boolean,
    default: false
  },
  pushSent: {
    type: Boolean,
    default: false
  },
  pushToken: {
    type: String,
    default: null
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
