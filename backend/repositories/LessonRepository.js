import Lesson from '../models/Lesson.js';

class LessonRepository {
    async findById(id) {
        return await Lesson.findOne({
            $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customId: id }],
            isDeleted: false
        }).lean();
    }

    async findByLanguage(language) {
        return await Lesson.find({ language: language.toLowerCase(), isDeleted: false })
            .sort({ lessonNumber: 1 })
            .lean();
    }

    async findByLanguageAndLevel(language, level) {
        return await Lesson.find({
            language: language.toLowerCase(),
            level: level.toLowerCase(),
            isDeleted: false
        }).sort({ lessonNumber: 1 }).lean();
    }

    async create(lessonData) {
        return await Lesson.create(lessonData);
    }

    async update(id, updateData) {
        return await Lesson.findOneAndUpdate(
            { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customId: id }], isDeleted: false },
            updateData,
            { new: true, runValidators: true }
        );
    }

    async softDelete(id) {
        return await Lesson.findOneAndUpdate(
            { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { customId: id }] },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );
    }

    async findAll({ filter = {}, skip = 0, limit = 10, sort = { lessonNumber: 1 }, search = null }) {
        const query = { isDeleted: false, ...filter };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { language: { $regex: search, $options: 'i' } }
            ];
        }

        const data = await Lesson.find(query).sort(sort).skip(skip).limit(limit).lean();
        const total = await Lesson.countDocuments(query);
        return { data, total };
    }
}

export default new LessonRepository();
