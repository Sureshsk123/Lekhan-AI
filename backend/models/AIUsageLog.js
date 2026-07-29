import mongoose from 'mongoose';

const aiUsageLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  feature: {
    type: String,
    enum: ['tutor', 'ocr', 'handwriting', 'story', 'quiz', 'stt', 'tts', 'general'],
    default: 'general'
  },
  modelName: {
    type: String,
    default: 'gemini-1.5-flash'
  },
  inputTokens: {
    type: Number,
    default: 0
  },
  outputTokens: {
    type: Number,
    default: 0
  },
  totalTokens: {
    type: Number,
    default: 0
  },
  latencyMs: {
    type: Number,
    default: 0
  },
  success: {
    type: Boolean,
    default: true
  },
  error: {
    type: String,
    default: null
  },
  estimatedCostUsd: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

aiUsageLogSchema.index({ userId: 1, timestamp: -1 });
aiUsageLogSchema.index({ feature: 1, success: 1 });

const AIUsageLog = mongoose.model('AIUsageLog', aiUsageLogSchema);

export default AIUsageLog;
