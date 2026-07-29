import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required'],
        index: true
    },
    language: {
        type: String,
        required: [true, 'Language is required'],
        lowercase: true,
        enum: ['tamil', 'telugu', 'hindi', 'kannada', 'malayalam', 'english'],
        index: true
    },
    lessonsCompleted: [{
        lessonId: { type: String, required: true },
        completedAt: { type: Date, default: Date.now },
        score: { type: Number, default: 0 },
        accuracy: { type: Number, default: 0 },
        timeSpent: { type: Number, default: 0 },
        xpEarned: { type: Number, default: 0 }
    }],
    wordsLearned: [{
        word: { type: String, required: true },
        translation: { type: String, default: '' },
        learnedAt: { type: Date, default: Date.now },
        proficiency: { type: Number, default: 50, min: 0, max: 100 }
    }],
    skillLevels: {
        handwriting: { type: Number, default: 0 },
        pronunciation: { type: Number, default: 0 },
        vocabulary: { type: Number, default: 0 },
        culture: { type: Number, default: 0 },
        listening: { type: Number, default: 0 },
        reading: { type: Number, default: 0 }
    },
    currentLevel: {
        type: String,
        default: 'alphabets'
    },
    weeklyActivity: [{
        date: { type: String },
        xp: { type: Number, default: 0 },
        timeSpent: { type: Number, default: 0 }
    }],
    totalTimeSpent: {
        type: Number,
        default: 0,
        min: 0
    },
    lastPracticeDate: {
        type: Date,
        default: null
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

progressSchema.index({ user: 1, language: 1 }, { unique: true });
progressSchema.index({ user: 1, isDeleted: 1 });

export default mongoose.model('Progress', progressSchema);
