export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'parent' | 'admin';
  targetLanguage?: string;
  xp?: number;
  streak?: number;
  level?: number;
  dailyGoal?: number;
  dailyGoalProgress?: number;
  themePreference?: 'light' | 'dark' | 'system';
  avatarUrl?: string;
  equippedTheme?: string;
  equippedAvatar?: string;
  equippedFrame?: string;
  equippedTitle?: string;
  badges?: string[];
  titles?: string[];
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Lesson {
  _id: string;
  id?: string;
  title: string;
  description: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  xpReward: number;
  estimatedMinutes: number;
  content?: any;
  order?: number;
  completed?: boolean;
}

export interface Story {
  _id: string;
  id?: string;
  title: string;
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  content: string;
  englishTranslation?: string;
  vocabularyList?: { word: string; translation: string; pronunciation?: string }[];
  audioUrl?: string;
  bookmarked?: boolean;
  isAiGenerated?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

export interface ChatSession {
  _id: string;
  id?: string;
  title: string;
  language: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'fill-blank' | 'listening' | 'speaking' | 'image';
  question: string;
  options?: string[];
  correctAnswer: string;
  audioUrl?: string;
  imageUrl?: string;
  explanation: string;
}

export interface Quiz {
  _id?: string;
  lessonId: string;
  questions: QuizQuestion[];
  xpReward: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  earnedXp: number;
  streakUpdated: boolean;
  newBadges: string[];
}

export interface ShopItem {
  _id: string;
  id?: string;
  name: string;
  description: string;
  type: 'theme' | 'avatar' | 'frame' | 'title' | 'booster' | 'badge';
  cost: number;
  imageUrl?: string;
  previewColor?: string;
  isUnlocked?: boolean;
  isEquipped?: boolean;
}

export interface Achievement {
  _id: string;
  id?: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl?: string;
  xp: number;
  country?: string;
  isCurrent?: boolean;
}

export interface SmartDashboardData {
  dailyActivity: { date: string; xp: number; studyMinutes: number }[];
  weeklyActivity: { day: string; xp: number }[];
  heatmapData: { date: string; count: number }[];
  recommendations: { id: string; type: 'lesson' | 'story' | 'quiz'; title: string; reason: string }[];
  weakTopics: string[];
  totalXP: number;
  currentStreak: number;
  studyHours: number;
}

export interface ChildProgress {
  childId: string;
  name: string;
  email: string;
  level: number;
  xp: number;
  streak: number;
  weakTopics: string[];
  recentLessons: { title: string; score: number; completedAt: string }[];
}





export interface AppNotification {
  _id: string;
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'leaderboard' | 'system';
  read: boolean;
  createdAt: string;
}
