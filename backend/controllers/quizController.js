import QuizService from '../services/QuizService.js';
import { generateAIQuizService, submitAIQuizService } from '../services/aiQuizService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const generateQuiz = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const quiz = await QuizService.generateQuiz(lessonId);

    if (!quiz) {
      return sendError(res, 404, 'Lesson not found');
    }

    return sendSuccess(res, 200, 'Quiz generated successfully', quiz, {
      lessonId: quiz.lessonId,
      questions: quiz.questions
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const result = await QuizService.submitQuiz(req.user, req.body);
    return sendSuccess(res, 200, 'Quiz submitted successfully', result, {
      attempt: result.attempt,
      xpEarned: result.xpEarned,
      diamondBonus: result.diamondBonus,
      newStats: result.newStats
    });
  } catch (error) {
    return sendError(res, 500, error.message);
  }
};

export const generateAIQuiz = async (req, res) => {
  try {
    const { topic, language, difficulty, totalQuestions } = req.body;
    const quiz = await generateAIQuizService(req.user._id, {
      topic,
      language,
      difficulty,
      totalQuestions
    });

    return res.status(200).json({
      success: true,
      message: 'Dynamic AI Quiz generated successfully',
      data: quiz
    });
  } catch (error) {
    console.error('Error generating AI quiz:', error);
    return sendError(res, 500, error.message || 'Failed to generate AI quiz');
  }
};

export const submitAIQuiz = async (req, res) => {
  try {
    const result = await submitAIQuizService(req.user, req.body);
    return res.status(200).json({
      success: true,
      message: 'AI Quiz auto-scored successfully',
      data: result
    });
  } catch (error) {
    console.error('Error submitting AI quiz:', error);
    return sendError(res, 500, error.message || 'Failed to score AI quiz');
  }
};

export default {
  generateQuiz,
  submitQuiz,
  generateAIQuiz,
  submitAIQuiz
};
