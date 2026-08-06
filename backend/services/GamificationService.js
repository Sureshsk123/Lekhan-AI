import GamificationRepository from '../repositories/GamificationRepository.js';
import UserRepository from '../repositories/UserRepository.js';
import QuizRepository from '../repositories/QuizRepository.js';
import ProgressRepository from '../repositories/ProgressRepository.js';
import { defaultAchievements } from '../config/achievementCatalog.js';

class GamificationService {
    async getAchievements(user) {
        if (!user) return { catalog: defaultAchievements, userAchievements: [] };

        // 1. Gather real user metrics from database
        const allProgress = await ProgressRepository.findByUserId(user._id).catch(() => []);
        const totalLessonsCompleted = allProgress.reduce((acc, p) => acc + (p.lessonsCompleted?.length || 0), 0);
        const totalWordsLearned = allProgress.reduce((acc, p) => acc + (p.wordsLearned?.length || 0), 0);

        let quizPassedCount = 0;
        let quizAttemptsCount = 0;
        try {
            const { data: quizAttempts } = await QuizRepository.findByUserId(user._id, { limit: 100 });
            quizAttemptsCount = quizAttempts?.length || 0;
            quizPassedCount = (quizAttempts || []).filter(a => a.passed || (a.score && a.score >= 60)).length;
        } catch (e) {}

        const userXP = user.xp || 0;
        const userStreak = typeof user.streak === 'object' ? (user.streak?.current || 0) : (user.streak || 0);
        const userCoins = user.diamonds || user.coins || 0;
        const userStoriesRead = user.storiesRead || (totalLessonsCompleted > 0 ? 1 : 0);

        const metrics = {
            lessons: totalLessonsCompleted,
            quizzes_passed: quizPassedCount,
            quiz_attempts: quizAttemptsCount,
            xp: userXP,
            streak: userStreak,
            stories: userStoriesRead,
            vocabulary: totalWordsLearned,
            coins: userCoins,
            perfect_quizzes: quizPassedCount
        };

        // 2. Map default catalog achievements and calculate dynamic progress & status
        const userAchievementsList = user.achievements || [];

        const evaluatedAchievements = defaultAchievements.map(ach => {
            const earnedRecord = userAchievementsList.find(a => a.id === ach.achievementId);
            const currentMetricVal = metrics[ach.targetMetric] || 0;
            const targetVal = ach.targetValue || 1;
            const isUnlocked = earnedRecord ? true : (currentMetricVal >= targetVal);
            const isClaimed = earnedRecord?.claimed || false;

            return {
                id: ach.achievementId,
                title: ach.name,
                description: ach.description,
                iconName: ach.icon || '🏆',
                category: ach.category || 'General',
                progress: Math.min(targetVal, currentMetricVal),
                total: targetVal,
                unlocked: isUnlocked,
                claimed: isClaimed,
                earnedAt: earnedRecord?.earnedAt || (isUnlocked ? new Date() : null),
                reward: `${ach.diamondReward || 20} Gems (${ach.xpReward || 50} XP)`
            };
        });

        const userEarnedOnly = evaluatedAchievements.filter(a => a.unlocked);

        return {
            catalog: evaluatedAchievements,
            userAchievements: userEarnedOnly,
            userMetrics: metrics
        };
    }

    async claimAchievement(user, achievementId) {
        const { catalog } = await this.getAchievements(user);
        const targetAch = catalog.find(a => a.id === achievementId);

        if (!targetAch) {
            throw new Error('Achievement not found');
        }
        if (!targetAch.unlocked) {
            throw new Error('Achievement not yet unlocked');
        }

        const freshUser = await UserRepository.findById(user._id);
        const existingRecord = (freshUser.achievements || []).find(a => a.id === achievementId);

        if (existingRecord && existingRecord.claimed) {
            return { alreadyClaimed: true, message: 'Reward already claimed' };
        }

        const gemReward = 30;
        const xpReward = 50;

        if (existingRecord) {
            existingRecord.claimed = true;
        } else {
            freshUser.achievements.push({
                id: achievementId,
                name: targetAch.title,
                icon: targetAch.iconName,
                description: targetAch.description,
                earnedAt: new Date(),
                claimed: true
            });
        }

        freshUser.diamonds = (freshUser.diamonds || 0) + gemReward;
        freshUser.xp = (freshUser.xp || 0) + xpReward;

        await freshUser.save();
        await GamificationRepository.addXPTransaction(user._id, xpReward, `Claimed Achievement: ${targetAch.title}`);

        return {
            claimed: true,
            achievementId,
            rewardGems: gemReward,
            rewardXP: xpReward,
            updatedDiamonds: freshUser.diamonds,
            updatedXP: freshUser.xp
        };
    }

    async checkAchievements(user) {
        const { catalog } = await this.getAchievements(user);
        const newlyEarned = catalog.filter(a => a.unlocked && !a.claimed);
        return {
            newlyEarned,
            totalAchievements: catalog.filter(a => a.unlocked).length
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
