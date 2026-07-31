import apiClient from './apiClient';

export const generateQuiz = async (quizId) => {
  const res = await apiClient.get(`/v1/quizzes/${quizId}`);
  return res.data;
};

export const submitQuiz = async (quizId, payload) => {
  const res = await apiClient.post(`/v1/quizzes/${quizId}/submit`, payload);
  return res.data;
};

export const generateAIQuiz = async (payload) => {
  const res = await apiClient.post('/quiz/ai-generate', payload);
  return res.data;
};

export const submitAIQuiz = async (payload) => {
  const res = await apiClient.post('/quiz/ai-submit', payload);
  return res.data;
};

export default {
  generateQuiz,
  submitQuiz,
  generateAIQuiz,
  submitAIQuiz
};
