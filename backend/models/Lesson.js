import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    customId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    language: {
        type: String,
        required: [true, 'Language is required'],
        lowercase: true,
        enum: ['tamil', 'telugu', 'hindi', 'kannada', 'malayalam', 'english'],
        index: true
    },
    level: {
        type: String,
        required: [true, 'Level is required'],
        lowercase: true,
        enum: ['beginner', 'intermediate', 'advanced', 'expert', 'alphabets', 'vowels', 'consonants', 'words', 'sentences'],
        index: true
    },
    unit: {
        type: Number,
        default: 1,
        index: true
    },
    lessonNumber: {
        type: Number,
        default: 1
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    content: {
        reading: {
            text: { type: String, default: '' },
            translation: { type: String, default: '' }
        },
        writing: [{
            character: { type: String, default: '' }
        }],
        speaking: [{
            phrase: { type: String, default: '' }
        }]
    },
    vocabulary: [{
        word: { type: String, default: '' },
        translation: { type: String, default: '' },
        transliteration: { type: String, default: '' }
    }],
    topics: [{
        title: { type: String, default: '' },
        introduction: { type: String, default: '' },
        vocabulary: [{
            word: { type: String, default: '' },
            translation: { type: String, default: '' },
            transliteration: { type: String, default: '' }
        }],
        pronunciation: [{
            phrase: { type: String, default: '' },
            translation: { type: String, default: '' }
        }],
        writing: [{
            character: { type: String, default: '' }
        }],
        listening: [{
            phrase: { type: String, default: '' },
            translation: { type: String, default: '' }
        }],
        reading: [{
            text: { type: String, default: '' },
            translation: { type: String, default: '' }
        }],
        practice: [{
            question: { type: String, default: '' },
            answer: { type: String, default: '' }
        }],
        quiz: [{
            question: { type: String, default: '' },
            options: [{ type: String }],
            correctAnswer: { type: String, default: '' }
        }]
    }],
    xpReward: {
        type: Number,
        default: 50,
        min: 0
    },
    diamondReward: {
        type: Number,
        default: 10,
        min: 0
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

lessonSchema.index({ language: 1, level: 1, lessonNumber: 1 });
lessonSchema.index({ language: 1, isDeleted: 1 });
lessonSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Lesson', lessonSchema);
