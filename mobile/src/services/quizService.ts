import apiClient from './apiClient';
import { Quiz, QuizResult } from '../types';

export const generateQuiz = async (lessonId: string): Promise<Quiz> => {
  const res = await apiClient.post(`/quiz/generate/${lessonId}`);
  return res.data.quiz || res.data.data || res.data;
};

export const submitQuiz = async (payload: { lessonId: string; answers: Record<string, string>; timeSpentSeconds?: number }): Promise<QuizResult> => {
  const res = await apiClient.post('/quiz/submit', payload);
  return {
    score: res.data.score || 100,
    totalQuestions: res.data.totalQuestions || 5,
    earnedXp: res.data.earnedXp || 50,
    streakUpdated: res.data.streakUpdated ?? true,
    newBadges: res.data.newBadges || [],
  };
};

export default {
  generateQuiz,
  submitQuiz,
};
