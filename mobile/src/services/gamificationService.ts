import apiClient from './apiClient';
import { Achievement, LeaderboardEntry } from '../types';

export const getAchievements = async (): Promise<Achievement[]> => {
  const res = await apiClient.get('/gamification/achievements');
  return res.data.achievements || res.data.data || [];
};

export const getLeaderboard = async (params: { scope?: 'global' | 'country' | 'friends'; period?: 'weekly' | 'monthly' } = {}): Promise<LeaderboardEntry[]> => {
  const res = await apiClient.get('/gamification/leaderboard', { params });
  return res.data.leaderboard || res.data.rankings || res.data.data || [];
};

export const getXPHistory = async (): Promise<{ date: string; xp: number }[]> => {
  const res = await apiClient.get('/gamification/xp-history');
  return res.data.xpHistory || res.data.data || [];
};

export default {
  getAchievements,
  getLeaderboard,
  getXPHistory,
};
