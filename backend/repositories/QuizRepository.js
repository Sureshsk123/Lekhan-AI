import QuizAttempt from '../models/QuizAttempt.js';

class QuizRepository {
    async createAttempt(attemptData) {
        return await QuizAttempt.create(attemptData);
    }

    async findByUserId(userId, { skip = 0, limit = 10 } = {}) {
        const data = await QuizAttempt.find({ userId, isDeleted: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = await QuizAttempt.countDocuments({ userId, isDeleted: false });
        return { data, total };
    }

    async findPerfectQuizCount(userId) {
        return await QuizAttempt.countDocuments({
            userId,
            isDeleted: false,
            $expr: { $gte: ['$score', '$totalQuestions'] }
        });
    }
}

export default new QuizRepository();
