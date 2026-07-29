import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Learning Session'
  },
  language: {
    type: String,
    default: 'English'
  },
  ageGroup: {
    type: String,
    enum: ['kids', 'teen', 'adult'],
    default: 'adult'
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Advanced'],
    default: 'Medium'
  },
  active: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

chatSessionSchema.index({ userId: 1, active: 1, updatedAt: -1 });

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;
