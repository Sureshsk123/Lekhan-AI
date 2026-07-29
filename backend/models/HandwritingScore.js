import mongoose from 'mongoose';

const handwritingScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  inputType: {
    type: String,
    enum: ['canvas', 'upload'],
    default: 'canvas'
  },
  targetChar: {
    type: String,
    default: 'A'
  },
  language: {
    type: String,
    default: 'Tamil'
  },
  score: {
    type: Number,
    default: 85
  },
  formation: {
    type: Number,
    default: 85
  },
  spacing: {
    type: Number,
    default: 80
  },
  consistency: {
    type: Number,
    default: 82
  },
  scores: {
    shape: { type: Number, default: 85 },
    strokeOrder: { type: Number, default: 80 },
    alignment: { type: Number, default: 82 },
    neatness: { type: Number, default: 85 }
  },
  mistakes: [{
    type: String
  }],
  tips: [{
    type: String
  }],
  feedback: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

handwritingScoreSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('HandwritingScore', handwritingScoreSchema);
