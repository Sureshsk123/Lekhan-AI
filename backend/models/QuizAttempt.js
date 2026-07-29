import mongoose from 'mongoose';

const quizAttemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  lessonId: {
    type: String,
    required: false,
    default: 'ai-dynamic-quiz',
    index: true
  },
  quizTitle: {
    type: String,
    default: 'Dynamic Quiz'
  },
  language: {
    type: String,
    default: 'tamil'
  },
  difficulty: {
    type: String,
    default: 'medium'
  },
  score: {
    type: Number,
    required: true,
    default: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  wrongAnswers: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  xpEarned: {
    type: Number,
    default: 0
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

quizAttemptSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('QuizAttempt', quizAttemptSchema);
