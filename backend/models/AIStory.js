import mongoose from 'mongoose';

const aiStorySchema = new mongoose.Schema({
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
  language: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard', 'Advanced'],
    default: 'Medium'
  },
  age: {
    type: String,
    enum: ['kids', 'teen', 'adult'],
    default: 'kids'
  },
  topic: {
    type: String,
    default: 'General'
  },
  length: {
    type: String,
    enum: ['short', 'medium', 'long'],
    default: 'short'
  },
  story: {
    type: String,
    required: true
  },
  translation: {
    type: String,
    required: true
  },
  vocabulary: [{
    word: String,
    transliteration: String,
    meaning: String
  }],
  moral: {
    type: String,
    default: ''
  },
  readingQuestions: [{
    question: String,
    options: [String],
    answer: String
  }],
  speakingPractice: [{
    type: String
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

aiStorySchema.index({ userId: 1, language: 1, createdAt: -1 });

export default mongoose.model('AIStory', aiStorySchema);
