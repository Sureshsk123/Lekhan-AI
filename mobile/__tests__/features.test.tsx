import lessonService from '../src/services/lessonService';
import storyService from '../src/services/storyService';
import aiTutorService from '../src/services/aiTutorService';
import handwritingService from '../src/services/handwritingService';
import quizService from '../src/services/quizService';
import shopService from '../src/services/shopService';
import gamificationService from '../src/services/gamificationService';
import smartDashboardService from '../src/services/smartDashboardService';

import apiClient from '../src/services/apiClient';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('../src/services/apiClient', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('Comprehensive Mobile Features & Services Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Lessons Feature', () => {
    it('fetches lessons list correctly', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { lessons: [{ _id: 'l1', title: 'Hindi Basics', language: 'Hindi', level: 'beginner' }] },
      });
      const lessons = await lessonService.getLessons({ language: 'Hindi' });
      expect(lessons).toHaveLength(1);
      expect(lessons[0].title).toBe('Hindi Basics');
    });
  });

  describe('Stories Feature', () => {
    it('fetches stories correctly', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { stories: [{ _id: 's1', title: 'The Clever Crow', language: 'Hindi' }] },
      });
      const stories = await storyService.getStories('Hindi');
      expect(stories).toHaveLength(1);
      expect(stories[0].title).toBe('The Clever Crow');
    });
  });

  describe('AI Tutor Feature', () => {
    it('asks AI tutor and receives reply', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: { reply: 'Namaste means hello in Hindi', sessionId: 'sess_123' },
      });
      const res = await aiTutorService.askAiTutor({ message: 'What is Namaste?' });
      expect(res.reply).toBe('Namaste means hello in Hindi');
      expect(res.sessionId).toBe('sess_123');
    });
  });


  describe('Handwriting Feature', () => {
    it('evaluates character drawing stroke accuracy', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: { score: 95, accuracy: 92, feedback: 'Great strokes!' },
      });
      const res = await handwritingService.evaluateHandwriting([], 'क', 'Hindi');
      expect(res.score).toBe(95);
    });
  });

  describe('Quiz Engine Feature', () => {
    it('submits quiz answers and calculates XP', async () => {
      (apiClient.post as jest.Mock).mockResolvedValueOnce({
        data: { score: 100, earnedXp: 50, streakUpdated: true },
      });
      const res = await quizService.submitQuiz({ lessonId: 'l1', answers: { q1: 'Namaste' } });
      expect(res.score).toBe(100);
      expect(res.earnedXp).toBe(50);
    });
  });

  describe('Shop & Gamification Feature', () => {
    it('fetches shop items and leaderboard', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { catalog: [{ _id: 'item_1', name: 'Cyberpunk Theme', cost: 200 }] },
      });
      const items = await shopService.getShopCatalog();
      expect(items).toHaveLength(1);

      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { leaderboard: [{ rank: 1, name: 'Aarav', xp: 1000 }] },
      });
      const lb = await gamificationService.getLeaderboard();
      expect(lb[0].rank).toBe(1);
    });
  });

  describe('Smart Dashboard Feature', () => {
    it('loads smart dashboard statistics', async () => {
      (apiClient.get as jest.Mock).mockResolvedValueOnce({
        data: { dashboard: { totalXP: 1450, currentStreak: 7, studyHours: 12.5 } },
      });
      const dash = await smartDashboardService.getSmartDashboard();
      expect(dash.totalXP).toBe(1450);
      expect(dash.currentStreak).toBe(7);
    });
  });
});
