import HandwritingService from '../services/HandwritingService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const evaluateHandwriting = async (req, res) => {
  try {
    const { targetChar = 'A', strokes, imageBase64, inputType, language = 'Tamil' } = req.body;
    if (!strokes && !imageBase64) {
      return sendError(res, 400, 'Either strokes or imageBase64 input is required');
    }

    const result = await HandwritingService.evaluate(req.user, {
      targetChar,
      strokes,
      imageBase64,
      inputType,
      language
    });

    return res.status(200).json({
      success: true,
      message: 'Handwriting evaluated successfully',
      data: {
        score: result.evaluation.score,
        formation: result.evaluation.formation,
        spacing: result.evaluation.spacing,
        consistency: result.evaluation.consistency,
        mistakes: result.evaluation.mistakes,
        tips: result.evaluation.tips,
        newXP: result.newXP,
        evaluation: result.evaluation
      }
    });
  } catch (error) {
    console.error('Error evaluating handwriting:', error);
    return sendError(res, 500, error.message || 'Handwriting evaluation failed');
  }
};

export const getHandwritingHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const history = await HandwritingService.getHistory(req.user._id, {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });

    return res.status(200).json({
      success: true,
      message: 'Handwriting evaluation history retrieved',
      data: history.data,
      pagination: history.pagination
    });
  } catch (error) {
    console.error('Error fetching handwriting history:', error);
    return sendError(res, 500, error.message || 'Failed to fetch history');
  }
};

export const getProgressGraphController = async (req, res) => {
  try {
    const graphData = await HandwritingService.getProgressGraph(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Handwriting progress graph data retrieved',
      data: graphData
    });
  } catch (error) {
    console.error('Error fetching handwriting progress graph:', error);
    return sendError(res, 500, error.message || 'Failed to fetch progress graph');
  }
};

export default {
  evaluateHandwriting,
  getHandwritingHistory,
  getProgressGraphController
};
