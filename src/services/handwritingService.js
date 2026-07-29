import apiClient from './apiClient';

export const evaluateHandwriting = async (payload) => {
  const res = await apiClient.post('/handwriting/evaluate', payload);
  return res.data;
};

export const getHandwritingHistory = async (params = {}) => {
  const res = await apiClient.get('/handwriting/history', { params });
  return res.data;
};

export const getProgressGraph = async () => {
  const res = await apiClient.get('/handwriting/progress-graph');
  return res.data;
};

export default {
  evaluateHandwriting,
  getHandwritingHistory,
  getProgressGraph
};
