import LessonRepository from '../repositories/LessonRepository.js';

class LessonService {
    async getLessonsByLanguage(language) {
        return await LessonRepository.findByLanguage(language);
    }

    async getLessonById(id) {
        return await LessonRepository.findById(id);
    }

    async createLesson(lessonData) {
        return await LessonRepository.create(lessonData);
    }

    async updateLesson(id, updateData) {
        return await LessonRepository.update(id, updateData);
    }

    async deleteLesson(id) {
        return await LessonRepository.softDelete(id);
    }

    async getAllLessons({ filter, skip, limit, sort, search }) {
        return await LessonRepository.findAll({ filter, skip, limit, sort, search });
    }
}

export default new LessonService();
