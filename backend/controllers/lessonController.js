import LessonService from '../services/LessonService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { getPaginationOptions, buildPaginatedResponse } from '../utils/pagination.js';

export const getLessonsByLanguage = async (req, res) => {
    try {
        const { language } = req.params;
        const lessons = await LessonService.getLessonsByLanguage(language);
        return sendSuccess(res, 200, 'Lessons retrieved successfully', { lessons }, { count: lessons.length, lessons });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const getLessonById = async (req, res) => {
    try {
        const lesson = await LessonService.getLessonById(req.params.id);
        if (!lesson) {
            return sendError(res, 404, 'Lesson not found');
        }
        return sendSuccess(res, 200, 'Lesson retrieved successfully', { lesson }, { lesson });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const getAllLessons = async (req, res) => {
    try {
        const options = getPaginationOptions(req.query);
        const filter = {};
        if (req.query.language) filter.language = req.query.language.toLowerCase();
        if (req.query.level) filter.level = req.query.level.toLowerCase();

        const { data, total } = await LessonService.getAllLessons({
            filter,
            skip: options.skip,
            limit: options.limit,
            sort: options.sort,
            search: options.search
        });

        const result = buildPaginatedResponse({ data, total, page: options.page, limit: options.limit });
        return sendSuccess(res, 200, 'Lessons fetched successfully', result, { count: data.length, lessons: data });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const createLesson = async (req, res) => {
    try {
        const lesson = await LessonService.createLesson(req.body);
        return sendSuccess(res, 201, 'Lesson created successfully', { lesson }, { lesson });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const updateLesson = async (req, res) => {
    try {
        const lesson = await LessonService.updateLesson(req.params.id, req.body);
        if (!lesson) return sendError(res, 404, 'Lesson not found');
        return sendSuccess(res, 200, 'Lesson updated successfully', { lesson }, { lesson });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const deleteLesson = async (req, res) => {
    try {
        const lesson = await LessonService.deleteLesson(req.params.id);
        if (!lesson) return sendError(res, 404, 'Lesson not found');
        return sendSuccess(res, 200, 'Lesson deleted successfully', { lesson });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

