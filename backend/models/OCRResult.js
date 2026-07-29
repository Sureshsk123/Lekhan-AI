import mongoose from 'mongoose';

const ocrResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  method: {
    type: String,
    default: 'gemini-vision'
  },
  fileType: {
    type: String,
    enum: ['png', 'jpg', 'jpeg', 'pdf', 'image/png', 'image/jpeg', 'application/pdf', 'canvas'],
    default: 'png'
  },
  extractedText: {
    type: String,
    default: ''
  },
  detectedText: {
    type: String,
    default: ''
  },
  confidence: {
    type: Number,
    default: 0.9
  },
  detectedLanguage: {
    type: String,
    default: 'Tamil'
  },
  language: {
    type: String,
    default: 'Tamil'
  },
  mistakes: [{
    type: String
  }],
  suggestions: [{
    type: String
  }],
  isCorrect: {
    type: Boolean,
    default: true
  },
  processingTime: {
    type: Number,
    default: 0
  },
  corrections: [{
    original: String,
    corrected: String,
    isCorrect: Boolean,
    message: String
  }],
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

ocrResultSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model('OCRResult', ocrResultSchema);
