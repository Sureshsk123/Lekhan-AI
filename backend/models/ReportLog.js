import mongoose from 'mongoose';

const reportLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  reportType: {
    type: String,
    enum: ['weekly', 'monthly', 'learning_summary', 'performance'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  startDate: Date,
  endDate: Date,
  summaryMetrics: {
    totalXP: { type: Number, default: 0 },
    studyTimeMinutes: { type: Number, default: 0 },
    lessonsCompleted: { type: Number, default: 0 },
    storiesRead: { type: Number, default: 0 },
    quizzesAttempted: { type: Number, default: 0 },
    avgQuizAccuracy: { type: Number, default: 0 },
    avgHandwritingScore: { type: Number, default: 0 }
  },
  weakAreasSummary: [String],
  recommendations: [String],
  pdfUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

reportLogSchema.index({ userId: 1, reportType: 1, createdAt: -1 });

const ReportLog = mongoose.model('ReportLog', reportLogSchema);

export default ReportLog;
