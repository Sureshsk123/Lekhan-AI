import { Router } from 'express';
import { storyController } from '../controllers/StoryController';

const router = Router();

router.get('/', storyController.getStories);
router.get('/language/:language', storyController.getStories);
router.get('/:id', storyController.getStoryById);

export default router;
