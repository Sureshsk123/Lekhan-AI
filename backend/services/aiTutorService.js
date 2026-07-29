import { generateGeminiContent } from './geminiService.js';
import { getTutorSystemPrompt, formatTutorUserPrompt } from './prompts/tutorPrompts.js';
import {
  createSession,
  findSessionById,
  findUserSessions,
  addMessage,
  getSessionHistory,
  updateSessionDifficulty,
  deleteSession
} from '../repositories/chatRepository.js';

export const startNewChatSession = async (sessionData) => {
  return await createSession(sessionData);
};

export const getUserChatSessions = async (params) => {
  return await findUserSessions(params);
};

export const getChatHistory = async (sessionId) => {
  return await getSessionHistory(sessionId);
};

export const processTutorQuery = async ({ userId, sessionId, message, language, ageGroup, difficulty }) => {
  let session = null;
  if (sessionId) {
    session = await findSessionById(sessionId);
  }

  if (!session) {
    session = await createSession({
      userId,
      language: language || 'Tamil',
      ageGroup: ageGroup || 'adult',
      difficulty: difficulty || 'Medium'
    });
  }

  const effectiveLanguage = language || session.language || 'Tamil';
  const effectiveAgeGroup = ageGroup || session.ageGroup || 'adult';
  let effectiveDifficulty = difficulty || session.difficulty || 'Medium';

  // Save user's question
  await addMessage({
    sessionId: session._id,
    userId,
    sender: 'user',
    text: message,
    language: effectiveLanguage
  });

  // Get previous chat history for conversation memory
  const history = await getSessionHistory(session._id, 10);

  const systemInstruction = getTutorSystemPrompt({
    ageGroup: effectiveAgeGroup,
    language: effectiveLanguage,
    difficulty: effectiveDifficulty
  });

  const formattedPrompt = formatTutorUserPrompt(message, history);

  const fallbackTutorResponse = `Hello! As your AI Language Tutor for ${effectiveLanguage}, here is an explanation for your query: "${message}".\n\n- Key Concept: Languages are best learned through step-by-step practice.\n- Practice Tip: Try pronouncing words slowly and writing them daily!`;

  const aiReplyText = await generateGeminiContent({
    prompt: formattedPrompt,
    systemInstruction,
    modelName: 'gemini-1.5-flash',
    fallback: fallbackTutorResponse,
    userId,
    feature: 'tutor'
  });

  // Auto difficulty adjustment check
  if (message.toLowerCase().includes('harder') || message.toLowerCase().includes('test me hard')) {
    effectiveDifficulty = 'Hard';
    await updateSessionDifficulty(session._id, 'Hard');
  } else if (message.toLowerCase().includes('easier') || message.toLowerCase().includes('explain simply')) {
    effectiveDifficulty = 'Easy';
    await updateSessionDifficulty(session._id, 'Easy');
  }

  // Save AI response
  const aiMessage = await addMessage({
    sessionId: session._id,
    userId,
    sender: 'ai',
    text: aiReplyText,
    language: effectiveLanguage,
    metadata: { difficulty: effectiveDifficulty }
  });

  return {
    session,
    aiMessage,
    reply: aiReplyText,
    difficulty: effectiveDifficulty
  };
};

export const clearChatSession = async (sessionId) => {
  return await deleteSession(sessionId);
};

export default {
  startNewChatSession,
  getUserChatSessions,
  getChatHistory,
  processTutorQuery,
  clearChatSession
};
