import apiClient from './apiClient';

export const evaluateHandwriting = async (payload) => {
  const res = await apiClient.post('/v1/handwriting/evaluate', payload);
  return res.data;
};

export const getHandwritingHistory = async (params = {}) => {
  // Not implemented on backend yet
  return { data: [] };
};

export const getProgressGraph = async () => {
  // Not implemented on backend yet
  return { data: [] };
};

export default {
  evaluateHandwriting,
  getHandwritingHistory,
  getProgressGraph
};
