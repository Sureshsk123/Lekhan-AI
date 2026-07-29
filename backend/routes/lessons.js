import express from 'express';
import { protect } from './auth.js';
import {
    getLessonsByLanguage,
    getLessonById,
    getAllLessons,
    createLesson,
    updateLesson,
    deleteLesson
} from '../controllers/lessonController.js';
import { createLessonValidation, updateLessonValidation } from '../validators/lessonValidator.js';

const router = express.Router();

// CRUD & Pagination
router.get('/', protect, getAllLessons);
router.get('/detail/:id', protect, getLessonById);
router.get('/:language', protect, getLessonsByLanguage);
router.post('/', protect, createLessonValidation, createLesson);
router.put('/:id', protect, updateLessonValidation, updateLesson);
router.delete('/:id', protect, deleteLesson);

export default router;
