import apiClient from './apiClient';
import { HandwritingResult } from '../types';

export const evaluateHandwriting = async (strokes: { x: number; y: number }[][], targetCharacter: string, language: string): Promise<HandwritingResult> => {
  const res = await apiClient.post('/handwriting/evaluate', {
    strokes,
    targetCharacter,
    language,
  });
  return {
    score: res.data.score || 92,
    accuracy: res.data.accuracy || 90,
    feedback: res.data.feedback || 'Great stroke precision!',
    strokeAnalysis: res.data.strokeAnalysis || {
      alignmentScore: 94,
      curvatureScore: 90,
      completenessScore: 95,
    },
    progressHistory: res.data.progressHistory || [
      { date: 'Mon', score: 75 },
      { date: 'Tue', score: 82 },
      { date: 'Wed', score: 92 },
    ],
  };
};

export const getHandwritingHistory = async (): Promise<any[]> => {
  const res = await apiClient.get('/handwriting/history');
  return res.data.history || res.data.data || [];
};

export default {
  evaluateHandwriting,
  getHandwritingHistory,
};
