import apiClient from './apiClient';

export const getAchievements = async () => {
  const res = await apiClient.get('/gamification/achievements');
  return res.data;
};

export const checkAchievements = async () => {
  const res = await apiClient.post('/gamification/check-achievements');
  return res.data;
};

export const getLeaderboard = async (params = {}) => {
  const res = await apiClient.get('/gamification/leaderboard', { params });
  return res.data;
};

export const getXPHistory = async () => {
  const res = await apiClient.get('/gamification/xp-history');
  return res.data;
};

export default {
  getAchievements,
  checkAchievements,
  getLeaderboard,
  getXPHistory
};
