import apiClient from './apiClient';

export const getPersonalizedProfile = async () => {
  const res = await apiClient.get('/personalized/profile');
  return res.data;
};

export const getPersonalizedRecommendations = async () => {
  const res = await apiClient.get('/personalized/recommendations');
  return res.data;
};

export default {
  getPersonalizedProfile,
  getPersonalizedRecommendations
};
