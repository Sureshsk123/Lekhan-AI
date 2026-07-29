import LearningAnalytics from '../models/LearningAnalytics.js';

class AnalyticsRepository {
    async recordAnalytics(userId, analyticsData) {
        return await LearningAnalytics.create({
            userId,
            ...analyticsData
        });
    }

    async findLatestByUserId(userId) {
        return await LearningAnalytics.findOne({ userId, isDeleted: false })
            .sort({ createdAt: -1 })
            .lean();
    }
}

export default new AnalyticsRepository();
