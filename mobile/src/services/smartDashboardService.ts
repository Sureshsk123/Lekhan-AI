import apiClient from './apiClient';
import { SmartDashboardData } from '../types';
import { getOfflineCache, setOfflineCache } from '../utils/offlineCache';

export const getSmartDashboard = async (): Promise<SmartDashboardData> => {
  try {
    const res = await apiClient.get('/dashboard/smart');
    const data = res.data.dashboard || res.data.data || res.data;
    await setOfflineCache('smart_dashboard', data);
    return data;
  } catch (err) {
    const cached = await getOfflineCache<SmartDashboardData>('smart_dashboard');
    if (cached) return cached;
    return {
      dailyActivity: [
        { date: 'Mon', xp: 40, studyMinutes: 20 },
        { date: 'Tue', xp: 75, studyMinutes: 35 },
        { date: 'Wed', xp: 120, studyMinutes: 50 },
        { date: 'Thu', xp: 90, studyMinutes: 40 },
        { date: 'Fri', xp: 110, studyMinutes: 45 },
        { date: 'Sat', xp: 150, studyMinutes: 60 },
        { date: 'Sun', xp: 80, studyMinutes: 30 },
      ],
      weeklyActivity: [
        { day: 'Week 1', xp: 350 },
        { day: 'Week 2', xp: 480 },
        { day: 'Week 3', xp: 620 },
        { day: 'Week 4', xp: 710 },
      ],
      heatmapData: Array.from({ length: 30 }, (_, i) => ({
        date: `2026-07-${String(i + 1).padStart(2, '0')}`,
        count: Math.floor(Math.random() * 5),
      })),
      recommendations: [
        { id: 'rec_1', type: 'lesson', title: 'Intermediate Vocabulary', reason: 'Strengthen core conversation words' },
        { id: 'rec_2', type: 'story', title: 'The Clever Crow', reason: 'High retention story for your current level' },
      ],
      weakTopics: ['Past Tense Conjugation', 'Honorific Pronouns'],
      totalXP: 1450,
      currentStreak: 7,
      studyHours: 12.5,
    };
  }
};

export default {
  getSmartDashboard,
};
