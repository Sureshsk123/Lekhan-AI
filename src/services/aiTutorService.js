import apiClient from './apiClient';

export const createChatSession = async (sessionData) => {
  const res = await apiClient.post('/ai-tutor/session', sessionData);
  return res.data;
};

export const getChatSessions = async () => {
  const res = await apiClient.get('/ai-tutor/session');
  return res.data;
};

export const askAiTutor = async (payload) => {
  const res = await apiClient.post('/ai-tutor/chat', payload);
  return res.data;
};

export const getChatHistory = async (sessionId) => {
  const res = await apiClient.get(`/ai-tutor/history/${sessionId}`);
  return res.data;
};

export const deleteChatSession = async (sessionId) => {
  const res = await apiClient.delete(`/ai-tutor/clear/${sessionId}`);
  return res.data;
};

export default {
  createChatSession,
  getChatSessions,
  askAiTutor,
  getChatHistory,
  deleteChatSession
};
