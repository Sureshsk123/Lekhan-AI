import User from '../models/User.js';
import Progress from '../models/Progress.js';

class UserRepository {
    async findById(id) {
        return await User.findOne({ _id: id, isDeleted: false }).select('-password');
    }

    async findByIdWithPassword(id) {
        return await User.findOne({ _id: id, isDeleted: false }).select('+password');
    }

    async findByEmail(email) {
        return await User.findOne({ email: email.toLowerCase(), isDeleted: false }).select('+password');
    }

    async findByUsername(username) {
        return await User.findOne({ username: username.trim(), isDeleted: false });
    }

    async create(userData) {
        return await User.create(userData);
    }

    async update(id, updateData) {
        return await User.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: true, runValidators: true }).select('-password');
    }

    async softDelete(id) {
        return await User.findOneAndUpdate({ _id: id }, { isDeleted: true, deletedAt: new Date() }, { new: true });
    }

    async getLeaderboard(limit = 50) {
        const users = await User.find({ isDeleted: false })
            .select('username fullName email avatar level xp diamonds streak activeTitle activeTheme')
            .lean();

        let allProgress = [];
        try {
            allProgress = await Progress.find({ isDeleted: false }).lean();
        } catch (e) {}

        const progressMap = {};
        allProgress.forEach(p => {
            const uId = String(p.user);
            if (!progressMap[uId]) progressMap[uId] = 0;
            progressMap[uId] += (p.lessonsCompleted?.length || 0);
        });

        const leaderboard = users.map(u => {
            const uId = String(u._id);
            const streakVal = typeof u.streak === 'object' ? (u.streak?.current || 0) : (u.streak || 0);
            const coinsVal = u.diamonds || u.coins || 0;
            const lessonsCount = progressMap[uId] || 0;

            return {
                id: u._id,
                username: u.username,
                name: u.fullName || u.username || 'Scholar',
                avatar: u.avatar || 'avatar1.png',
                level: u.level || 1,
                xp: u.xp || 0,
                coins: coinsVal,
                streak: streakVal,
                lessonsCompleted: lessonsCount,
                badge: u.activeTitle || (u.xp >= 1000 ? 'Grandmaster' : u.xp >= 500 ? 'Scholar' : 'Explorer')
            };
        });

        // 4-Tier Sorting: 1. XP desc, 2. Lessons Completed desc, 3. Streak desc, 4. Coins desc
        leaderboard.sort((a, b) => {
            if (b.xp !== a.xp) return b.xp - a.xp;
            if (b.lessonsCompleted !== a.lessonsCompleted) return b.lessonsCompleted - a.lessonsCompleted;
            if (b.streak !== a.streak) return b.streak - a.streak;
            return b.coins - a.coins;
        });

        return leaderboard.slice(0, limit).map((player, index) => ({
            ...player,
            rank: index + 1
        }));
    }

    async findAll({ filter = {}, skip = 0, limit = 10, sort = { createdAt: -1 } }) {
        const query = { isDeleted: false, ...filter };
        const data = await User.find(query).sort(sort).skip(skip).limit(limit).select('-password').lean();
        const total = await User.countDocuments(query);
        return { data, total };
    }
}

export default new UserRepository();
