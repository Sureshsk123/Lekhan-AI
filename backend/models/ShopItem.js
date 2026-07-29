import mongoose from 'mongoose';

const shopItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['themes', 'stickers', 'avatars', 'frames', 'titles', 'badges', 'sticker_packs', 'boosters'],
    lowercase: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  emoji: {
    type: String,
    default: '🎁'
  },
  description: {
    type: String,
    default: ''
  },
  boosterMultiplier: {
    type: Number,
    default: 1.0
  },
  boosterDurationHours: {
    type: Number,
    default: 24
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

shopItemSchema.index({ category: 1, price: 1 });

export default mongoose.model('ShopItem', shopItemSchema);
