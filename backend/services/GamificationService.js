import GamificationRepository from '../repositories/GamificationRepository.js';
import UserRepository from '../repositories/UserRepository.js';
import QuizRepository from '../repositories/QuizRepository.js';

class GamificationService {
    async getAchievements(user) {
        const catalog = await GamificationRepository.getAchievementsCatalog();
        return {
            catalog,
            userAchievements: user.achievements || []
        };
    }

    async checkAchievements(user) {
        const newlyEarned = [];

        // 1. First Lesson
        const { total: quizCount } = await QuizRepository.findByUserId(user._id, { limit: 1 });
        if (quizCount > 0) {
            const achievement = await GamificationRepository.awardAchievement(user._id, 'first_lesson');
            if (achievement) newlyEarned.push(achievement);
        }

        // 2. Quiz Master (5 perfect scores)
        const perfectCount = await QuizRepository.findPerfectQuizCount(user._id);
        if (perfectCount >= 5) {
            const achievement = await GamificationRepository.awardAchievement(user._id, 'quiz_master');
            if (achievement) newlyEarned.push(achievement);
        }

        // 3. Streak 7
        if (user.streak && user.streak.current >= 7) {
            const achievement = await GamificationRepository.awardAchievement(user._id, 'streak_7');
            if (achievement) newlyEarned.push(achievement);
        }

        // 4. Polyglot
        if (user.enrolledLanguages && user.enrolledLanguages.length >= 3) {
            const achievement = await GamificationRepository.awardAchievement(user._id, 'polyglot');
            if (achievement) newlyEarned.push(achievement);
        }

        const freshUser = await UserRepository.findById(user._id);

        return {
            newlyEarned,
            totalAchievements: freshUser.achievements ? freshUser.achievements.length : 0
        };
    }

    async getXPHistory(userId, options) {
        return await GamificationRepository.getXPHistory(userId, options);
    }

    async getLeaderboard(limit = 10) {
        return await UserRepository.getLeaderboard(limit);
    }
}

export default new GamificationService();
