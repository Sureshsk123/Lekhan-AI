import UserRepository from '../repositories/UserRepository.js';
import GamificationRepository from '../repositories/GamificationRepository.js';

class UserService {
    async getProfile(userId) {
        return await UserRepository.findById(userId);
    }

    async updateProfile(userId, updateData) {
        return await UserRepository.update(userId, updateData);
    }

    async addXP(user, amount) {
        const newXP = user.xp + amount;
        const newLevel = Math.floor(newXP / 1000) + 1;
        const levelBonus = newLevel > user.level ? 50 : 0;

        const updatedUser = await UserRepository.update(user._id, {
            xp: newXP,
            level: newLevel,
            diamonds: user.diamonds + levelBonus
        });

        await GamificationRepository.addXPTransaction(user._id, amount, 'Direct XP Update');

        return {
            xp: updatedUser.xp,
            level: updatedUser.level,
            diamonds: updatedUser.diamonds
        };
    }

    async updateDiamonds(user, amount) {
        let newDiamonds = user.diamonds + amount;
        if (newDiamonds < 0) newDiamonds = 0;

        const updatedUser = await UserRepository.update(user._id, {
            diamonds: newDiamonds
        });

        return {
            diamonds: updatedUser.diamonds
        };
    }

    async addAchievement(user, { name, icon, description }) {
        const newAchievement = {
            name,
            icon: icon || '🏆',
            description: description || '',
            earnedAt: new Date()
        };

        const updatedUser = await UserRepository.update(user._id, {
            $push: { achievements: newAchievement }
        });

        return updatedUser.achievements;
    }
}

export default new UserService();
