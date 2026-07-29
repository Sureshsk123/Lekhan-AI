import Story from '../models/Story.js';

class StoryRepository {
    async findById(id) {
        return await Story.findOne({
            $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customId: id }],
            isDeleted: false
        });
    }

    async findStories({ language, category }) {
        const query = { isDeleted: false };
        if (language) query.language = language.toLowerCase();
        if (category) query.category = category.toLowerCase();
        return await Story.find(query).sort({ readCount: -1 }).lean();
    }

    async incrementReadCount(id) {
        return await Story.findOneAndUpdate(
            { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customId: id }], isDeleted: false },
            { $inc: { readCount: 1 } },
            { new: true }
        );
    }

    async toggleBookmark(id, userId) {
        const story = await this.findById(id);
        if (!story) return null;

        const isBookmarked = story.bookmarks.includes(userId);
        if (isBookmarked) {
            story.bookmarks.pull(userId);
        } else {
            story.bookmarks.push(userId);
        }

        await story.save();
        return story;
    }

    async create(storyData) {
        return await Story.create(storyData);
    }

    async update(id, updateData) {
        return await Story.findOneAndUpdate(
            { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customId: id }], isDeleted: false },
            updateData,
            { new: true, runValidators: true }
        );
    }

    async softDelete(id) {
        return await Story.findOneAndUpdate(
            { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customId: id }] },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );
    }

    async findAll({ filter = {}, skip = 0, limit = 10, sort = { readCount: -1 }, search = null }) {
        const query = { isDeleted: false, ...filter };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { translation: { $regex: search, $options: 'i' } }
            ];
        }

        const data = await Story.find(query).sort(sort).skip(skip).limit(limit).lean();
        const total = await Story.countDocuments(query);
        return { data, total };
    }
}

export default new StoryRepository();
