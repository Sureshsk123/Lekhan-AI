import { validationResult } from 'express-validator';
import {
  startNewChatSession,
  getUserChatSessions,
  getChatHistory,
  processTutorQuery,
  clearChatSession
} from '../services/aiTutorService.js';

export const createChatSession = async (req, res) => {
  try {
    const session = await startNewChatSession({
      userId: req.user._id,
      ...req.body
    });
    res.status(201).json({
      success: true,
      message: 'Chat session created successfully',
      data: session
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create chat session',
      errors: [{ field: 'chat_session', message: error.message }]
    });
  }
};

export const getSessions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await getUserChatSessions({
      userId: req.user._id,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });
    res.status(200).json({
      success: true,
      message: 'Chat sessions fetched successfully',
      data: result.sessions,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting chat sessions:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get chat sessions',
      errors: [{ field: 'chat_session', message: error.message }]
    });
  }
};

export const askAiTutor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }

  try {
    const { message, sessionId, language, ageGroup, difficulty } = req.body;
    const result = await processTutorQuery({
      userId: req.user._id,
      sessionId,
      message,
      language,
      ageGroup,
      difficulty
    });

    res.status(200).json({
      success: true,
      message: 'AI Tutor response generated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in askAiTutor:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'AI Tutor query failed',
      errors: [{ field: 'ai_tutor', message: error.message }]
    });
  }
};

export const fetchSessionHistory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }

  try {
    const history = await getChatHistory(req.params.sessionId);
    res.status(200).json({
      success: true,
      message: 'Chat history fetched successfully',
      data: history
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch chat history',
      errors: [{ field: 'chat_history', message: error.message }]
    });
  }
};

export const removeSession = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }

  try {
    await clearChatSession(req.params.sessionId);
    res.status(200).json({
      success: true,
      message: 'Chat session deleted successfully'
    });
  } catch (error) {
    console.error('Error removing chat session:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete chat session',
      errors: [{ field: 'chat_delete', message: error.message }]
    });
  }
};

export default {
  createChatSession,
  getSessions,
  askAiTutor,
  fetchSessionHistory,
  removeSession
};
