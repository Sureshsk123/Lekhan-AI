import mongoose from 'mongoose';

const parentChildLinkSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  relationship: {
    type: String,
    enum: ['parent', 'guardian', 'tutor'],
    default: 'parent'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rejected'],
    default: 'active'
  },
  permissions: {
    viewProgress: { type: Boolean, default: true },
    receiveWeeklyReports: { type: Boolean, default: true },
    manageReminders: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

parentChildLinkSchema.index({ parentId: 1, childId: 1 }, { unique: true });

const ParentChildLink = mongoose.model('ParentChildLink', parentChildLinkSchema);

export default ParentChildLink;
