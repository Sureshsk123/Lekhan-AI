import mongoose from 'mongoose';

const learningProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  languageProficiency: {
    type: Map,
    of: Number,
    default: { tamil: 50, hindi: 50, telugu: 50, malayalam: 50, kannada: 50, english: 50 }
  },
  weakAlphabets: [{
    character: String,
    language: String,
    errorCount: Number,
    lastPracticed: Date
  }],
  weakVocabulary: [{
    word: String,
    meaning: String,
    language: String,
    errorCount: Number,
    lastPracticed: Date
  }],
  weakPronunciation: [{
    phrase: String,
    score: Number,
    language: String,
    lastTested: Date
  }],
  weakHandwriting: [{
    character: String,
    score: Number,
    issue: String,
    lastEvaluated: Date
  }],
  weakGrammar: [{
    topic: String,
    language: String,
    errorCount: Number
  }],
  recommendations: [{
    type: { type: String, enum: ['lesson', 'story', 'quiz', 'practice'] },
    title: String,
    targetId: String,
    language: String,
    reason: String,
    createdAt: { type: Date, default: Date.now }
  }],
  lastAnalyzed: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const LearningProfile = mongoose.model('LearningProfile', learningProfileSchema);

export default LearningProfile;
