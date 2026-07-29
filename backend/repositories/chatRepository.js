import ChatSession from '../models/ChatSession.js';
import ChatMessage from '../models/ChatMessage.js';

export const createSession = async ({ userId, title, language, ageGroup, difficulty, metadata }) => {
  const session = new ChatSession({
    userId,
    title: title || `Learning ${language || 'Language'} Session`,
    language: language || 'English',
    ageGroup: ageGroup || 'adult',
    difficulty: difficulty || 'Medium',
    metadata: metadata || {}
  });
  return await session.save();
};

export const findSessionById = async (sessionId) => {
  return await ChatSession.findById(sessionId);
};

export const findUserSessions = async ({ userId, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;
  const sessions = await ChatSession.find({ userId, active: true })
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await ChatSession.countDocuments({ userId, active: true });
  return {
    sessions,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

export const addMessage = async ({ sessionId, userId, sender, text, language, metadata }) => {
  const message = new ChatMessage({
    sessionId,
    userId,
    sender,
    text,
    language: language || 'English',
    metadata: metadata || {}
  });
  const saved = await message.save();
  await ChatSession.findByIdAndUpdate(sessionId, { updatedAt: new Date() });
  return saved;
};

export const getSessionHistory = async (sessionId, limit = 20) => {
  return await ChatMessage.find({ sessionId })
    .sort({ createdAt: 1 })
    .limit(limit);
};

export const updateSessionDifficulty = async (sessionId, newDifficulty) => {
  return await ChatSession.findByIdAndUpdate(
    sessionId,
    { difficulty: newDifficulty, updatedAt: new Date() },
    { new: true }
  );
};

export const deleteSession = async (sessionId) => {
  await ChatMessage.deleteMany({ sessionId });
  return await ChatSession.findByIdAndUpdate(sessionId, { active: false }, { new: true });
};

export default {
  createSession,
  findSessionById,
  findUserSessions,
  addMessage,
  getSessionHistory,
  updateSessionDifficulty,
  deleteSession
};
