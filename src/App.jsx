import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import FloatingActionButton from './components/layout/FloatingActionButton';

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import SmartDashboardPage from './pages/dashboard/SmartDashboardPage';
import AiTutorPage from './pages/tutor/AiTutorPage';
import LessonsListPage from './pages/lessons/LessonsListPage';
import LessonDetailPage from './pages/lessons/LessonDetailPage';
import StoriesPage from './pages/stories/StoriesPage';
import StoryReaderPage from './pages/stories/StoryReaderPage';
import QuizPage from './pages/quiz/QuizPage';
import QuizResultsPage from './pages/quiz/QuizResultsPage';

import ShopPage from './pages/shop/ShopPage';
import InventoryPage from './pages/inventory/InventoryPage';
import NotificationCenterPage from './pages/notifications/NotificationCenterPage';
import ParentDashboardPage from './pages/parent/ParentDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import ReportsPage from './pages/reports/ReportsPage';
import GlobalSearchPage from './pages/search/GlobalSearchPage';
import SettingsPage from './pages/settings/SettingsPage';
import ProfilePage from './pages/profile/ProfilePage';

// New Pages

import VocabularyPage from './pages/vocabulary/VocabularyPage';
import LeaderboardPage from './pages/leaderboard/LeaderboardPage';
import PronunciationPage from './pages/pronunciation/PronunciationPage';
import AchievementsPage from './pages/achievements/AchievementsPage';

// Protected Route Guard
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-400">Loading LangSphere AI...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protected Student / General Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><SmartDashboardPage /></ProtectedRoute>} />
                <Route path="/ai-tutor" element={<ProtectedRoute><AiTutorPage /></ProtectedRoute>} />
                <Route path="/lessons/:language?" element={<ProtectedRoute><LessonsListPage /></ProtectedRoute>} />
                <Route path="/lesson/:id" element={<ProtectedRoute><LessonDetailPage /></ProtectedRoute>} />
                <Route path="/stories/:language?" element={<ProtectedRoute><StoriesPage /></ProtectedRoute>} />
                <Route path="/story/:id" element={<ProtectedRoute><StoryReaderPage /></ProtectedRoute>} />
                <Route path="/quiz/:lessonId?" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
                <Route path="/quiz-results" element={<ProtectedRoute><QuizResultsPage /></ProtectedRoute>} />

                <Route path="/vocabulary" element={<ProtectedRoute><VocabularyPage /></ProtectedRoute>} />
                <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
                <Route path="/pronunciation" element={<ProtectedRoute><PronunciationPage /></ProtectedRoute>} />
                <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
                <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationCenterPage /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><GlobalSearchPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                {/* Parent Route */}
                <Route path="/parent-dashboard" element={<ProtectedRoute><ParentDashboardPage /></ProtectedRoute>} />

                {/* Admin Route */}
                <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} />

                {/* Fallback Catch-All */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <FloatingActionButton />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
