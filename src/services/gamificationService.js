import apiClient from './apiClient';

export const getUserAchievements = async () => {
  try {
    const res = await apiClient.get('/gamification/achievements').catch(() => null);
    if (res?.data?.data) {
      return res.data;
    }
    // Fallback for v1 route structure
    const fallbackRes = await apiClient.get('/v1/gamification/achievements').catch(() => null);
    return fallbackRes?.data || null;
  } catch (err) {
    console.error('Fetch user achievements error:', err);
    return null;
  }
};

export const claimAchievementReward = async (achievementId) => {
  try {
    const res = await apiClient.post('/gamification/claim', { achievementId }).catch(() => null);
    if (res?.data) {
      return res.data;
    }
    const fallbackRes = await apiClient.post('/v1/gamification/claim', { achievementId }).catch(() => null);
    return fallbackRes?.data || null;
  } catch (err) {
    console.error('Claim achievement reward error:', err);
    return null;
  }
};

export const getLeaderboard = async (limit = 50) => {
  try {
    const res = await apiClient.get('/gamification/leaderboard', { params: { limit } }).catch(() => null);
    if (res?.data?.data?.leaderboard || res?.data?.leaderboard) {
      return res.data?.data?.leaderboard || res.data?.leaderboard;
    }
    const fallbackRes = await apiClient.get('/v1/leaderboard', { params: { limit } }).catch(() => null);
    return fallbackRes?.data?.data?.leaderboard || fallbackRes?.data?.leaderboard || [];
  } catch (err) {
    console.error('Fetch leaderboard error:', err);
    return [];
  }
};

export default {
  getUserAchievements,
  claimAchievementReward,
  getLeaderboard
};
