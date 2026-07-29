import { analyzeAndGetPersonalizedRecommendations } from '../services/personalizedLearningService.js';
import { sendError } from '../utils/responseHandler.js';

export const getPersonalizedProfile = async (req, res) => {
  try {
    const result = await analyzeAndGetPersonalizedRecommendations(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Personalized learning profile and recommendations retrieved',
      data: result
    });
  } catch (error) {
    console.error('Error in getPersonalizedProfile:', error);
    return sendError(res, 500, error.message || 'Failed to retrieve personalized learning profile');
  }
};

export default {
  getPersonalizedProfile
};
