import mongoose from 'mongoose';

const storySchema = new mongoose.Schema({
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
    category: {
        type: String,
        default: 'short',
        lowercase: true,
        index: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    translation: {
        type: String,
        default: ''
    },
    readCount: {
        type: Number,
        default: 0,
        min: 0,
        index: true
    },
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

storySchema.index({ language: 1, category: 1 });
storySchema.index({ readCount: -1 });
storySchema.index({ title: 'text', content: 'text', translation: 'text' });

export default mongoose.model('Story', storySchema);
