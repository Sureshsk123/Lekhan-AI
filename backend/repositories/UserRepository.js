import User from '../models/User.js';

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

    async getLeaderboard(limit = 10) {
        return await User.find({ isDeleted: false })
            .sort({ xp: -1 })
            .limit(limit)
            .select('username xp level avatar activeTitle activeTheme');
    }

    async findAll({ filter = {}, skip = 0, limit = 10, sort = { createdAt: -1 } }) {
        const query = { isDeleted: false, ...filter };
        const data = await User.find(query).sort(sort).skip(skip).limit(limit).select('-password').lean();
        const total = await User.countDocuments(query);
        return { data, total };
    }
}

export default new UserRepository();
