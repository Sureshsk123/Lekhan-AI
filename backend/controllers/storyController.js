import StoryService from '../services/StoryService.js';
import { generateAIStory, getUserGeneratedStories } from '../services/aiStoryService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { getPaginationOptions, buildPaginatedResponse } from '../utils/pagination.js';

export const getStories = async (req, res) => {
  try {
    const { language } = req.params;
    const { category } = req.query;

    const results = await StoryService.getStories({ language, category });
    return sendSuccess(res, 200, 'Stories retrieved successfully', { stories: results }, { count: results.length, stories: results });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getStoryById = async (req, res) => {
  try {
    const story = await StoryService.getStoryById(req.params.id);
    if (!story) {
      return sendError(res, 404, 'Story not found');
    }
    return sendSuccess(res, 200, 'Story retrieved successfully', { story }, { story });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const getAllStories = async (req, res) => {
  try {
    const options = getPaginationOptions(req.query);
    const filter = {};
    if (req.query.language) filter.language = req.query.language.toLowerCase();
    if (req.query.category) filter.category = req.query.category.toLowerCase();

    const { data, total } = await StoryService.getAllStories({
      filter,
      skip: options.skip,
      limit: options.limit,
      sort: options.sort,
      search: options.search
    });

    const result = buildPaginatedResponse({ data, total, page: options.page, limit: options.limit });
    return sendSuccess(res, 200, 'Stories fetched successfully', result, { count: data.length, stories: data });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const createStory = async (req, res) => {
  try {
    const story = await StoryService.createStory(req.body);
    return sendSuccess(res, 201, 'Story created successfully', { story }, { story });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const updateStory = async (req, res) => {
  try {
    const story = await StoryService.updateStory(req.params.id, req.body);
    if (!story) return sendError(res, 404, 'Story not found');
    return sendSuccess(res, 200, 'Story updated successfully', { story }, { story });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const deleteStory = async (req, res) => {
  try {
    const story = await StoryService.deleteStory(req.params.id);
    if (!story) return sendError(res, 404, 'Story not found');
    return sendSuccess(res, 200, 'Story deleted successfully', { story });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const toggleBookmark = async (req, res) => {
  try {
    const story = await StoryService.toggleBookmark(req.params.id, req.user._id);
    if (!story) return sendError(res, 404, 'Story not found');
    return sendSuccess(res, 200, 'Bookmark updated', { story });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const generateStoryController = async (req, res) => {
  try {
    const { language, difficulty, age, topic, length } = req.body;
    const generated = await generateAIStory(req.user._id, {
      language,
      difficulty,
      age,
      topic,
      length
    });

    return res.status(201).json({
      success: true,
      message: 'AI Story generated and saved successfully',
      data: generated
    });
  } catch (error) {
    console.error('Error generating AI story:', error);
    return sendError(res, 500, error.message || 'Failed to generate AI story');
  }
};

export const getMyGeneratedStoriesController = async (req, res) => {
  try {
    const { page = 1, limit = 10, language } = req.query;
    const result = await getUserGeneratedStories(req.user._id, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      language
    });

    return res.status(200).json({
      success: true,
      message: 'Generated stories fetched successfully',
      data: result.stories,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error fetching generated stories:', error);
    return sendError(res, 500, error.message || 'Failed to fetch generated stories');
  }
};

export default {
  getStories,
  getStoryById,
  getAllStories,
  createStory,
  updateStory,
  deleteStory,
  toggleBookmark,
  generateStoryController,
  getMyGeneratedStoriesController
};
