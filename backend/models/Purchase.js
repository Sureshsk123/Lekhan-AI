import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    itemId: {
        type: String,
        required: true
    },
    itemType: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    purchasedAt: {
        type: Date,
        default: Date.now
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

purchaseSchema.index({ userId: 1, purchasedAt: -1 });

export default mongoose.model('Purchase', purchaseSchema);
