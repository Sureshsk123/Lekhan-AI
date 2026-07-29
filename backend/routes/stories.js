import express from 'express';
import protect from '../middleware/auth.js';
import {
  getStories,
  getStoryById,
  getAllStories,
  createStory,
  updateStory,
  deleteStory,
  toggleBookmark,
  generateStoryController,
  getMyGeneratedStoriesController
} from '../controllers/storyController.js';
import { createStoryValidation, updateStoryValidation } from '../validators/storyValidator.js';

const router = express.Router();

router.use(protect);

router.post('/generate', generateStoryController);
router.get('/my-generated', getMyGeneratedStoriesController);

router.get('/', getAllStories);
router.get('/:language', getStories);
router.get('/:language/:id', getStoryById);
router.post('/', createStoryValidation, createStory);
router.put('/:id', updateStoryValidation, updateStory);
router.delete('/:id', deleteStory);
router.post('/:id/bookmark', toggleBookmark);

export default router;
