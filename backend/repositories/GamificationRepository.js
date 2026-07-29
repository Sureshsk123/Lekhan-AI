import Achievement from '../models/Achievement.js';
import XPTransaction from '../models/XPTransaction.js';
import User from '../models/User.js';

class GamificationRepository {
    async getAchievementsCatalog() {
        return await Achievement.find({ isDeleted: false }).lean();
    }

    async findAchievementById(achievementId) {
        return await Achievement.findOne({ achievementId, isDeleted: false });
    }

    async addXPTransaction(userId, amount, source) {
        return await XPTransaction.create({
            userId,
            amount,
            source
        });
    }

    async getXPHistory(userId, { skip = 0, limit = 20 } = {}) {
        const data = await XPTransaction.find({ userId, isDeleted: false })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        const total = await XPTransaction.countDocuments({ userId, isDeleted: false });
        return { data, total };
    }

    async awardAchievement(userId, achievementId) {
        const user = await User.findOne({ _id: userId, isDeleted: false });
        if (!user) return null;

        if (user.achievements.some(a => a.id === achievementId)) {
            return null;
        }

        const catalogItem = await this.findAchievementById(achievementId);
        if (!catalogItem) return null;

        const newAchievement = {
            id: catalogItem.achievementId,
            name: catalogItem.name,
            icon: catalogItem.icon,
            description: catalogItem.description,
            earnedAt: new Date()
        };

        user.achievements.push(newAchievement);
        user.xp += (catalogItem.xpReward || 0);
        user.diamonds += (catalogItem.diamondReward || 0);

        await user.save();
        await this.addXPTransaction(userId, catalogItem.xpReward, `Achievement: ${catalogItem.name}`);
        return newAchievement;
    }
}

export default new GamificationRepository();
