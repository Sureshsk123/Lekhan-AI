import apiClient from './apiClient';

export const generateQuiz = async (lessonId) => {
  const res = await apiClient.post(`/quiz/generate/${lessonId}`);
  return res.data;
};

export const submitQuiz = async (payload) => {
  const res = await apiClient.post('/quiz/submit', payload);
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
