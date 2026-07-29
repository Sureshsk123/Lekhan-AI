import mongoose from 'mongoose';

const sttLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  language: {
    type: String,
    default: 'Tamil'
  },
  expectedText: {
    type: String,
    default: ''
  },
  transcription: {
    type: String,
    required: true
  },
  pronunciationScore: {
    type: Number,
    default: 85
  },
  detectedMistakes: [{
    type: String
  }],
  accentFeedback: {
    type: String,
    default: ''
  },
  audioUrl: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

sttLogSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('STTLog', sttLogSchema);
