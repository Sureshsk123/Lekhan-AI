import mongoose from 'mongoose';

const learningAnalyticsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    stats: {
        lessonsCompleted: { type: Number, default: 0 },
        quizAccuracy: { type: Number, default: 0 },
        writingAccuracy: { type: Number, default: 0 },
        xpEarned: { type: Number, default: 0 },
        currentLevel: { type: Number, default: 1 },
        streakCount: { type: Number, default: 0 },
        totalTimeSpent: { type: Number, default: 0 },
        languagesCount: { type: Number, default: 0 }
    },
    weakVocabulary: [{
        word: String,
        language: String,
        proficiency: Number
    }],
    progressOverTime: [{
        month: String,
        xp: Number
    }],
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

learningAnalyticsSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('LearningAnalytics', learningAnalyticsSchema);
