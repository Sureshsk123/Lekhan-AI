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
import SmartDashboardPage from './pages/dashboard/SmartDashboardPage';
import AiTutorPage from './pages/tutor/AiTutorPage';
import LessonsListPage from './pages/lessons/LessonsListPage';
import LessonDetailPage from './pages/lessons/LessonDetailPage';
import StoriesPage from './pages/stories/StoriesPage';
import StoryReaderPage from './pages/stories/StoryReaderPage';
import QuizPage from './pages/quiz/QuizPage';
import QuizResultsPage from './pages/quiz/QuizResultsPage';
import VisionOcrPage from './pages/ocr/VisionOcrPage';
import HandwritingCanvasPage from './pages/handwriting/HandwritingCanvasPage';
import PersonalizedLearningPage from './pages/personalized/PersonalizedLearningPage';
import ShopPage from './pages/shop/ShopPage';
import InventoryPage from './pages/inventory/InventoryPage';
import LeaderboardsPage from './pages/leaderboards/LeaderboardsPage';
import NotificationCenterPage from './pages/notifications/NotificationCenterPage';
import ParentDashboardPage from './pages/parent/ParentDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import ReportsPage from './pages/reports/ReportsPage';
import GlobalSearchPage from './pages/search/GlobalSearchPage';
import SettingsPage from './pages/settings/SettingsPage';

// Protected Route Guard
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
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
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                {/* Protected Student / General Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><SmartDashboardPage /></ProtectedRoute>} />
                <Route path="/ai-tutor" element={<ProtectedRoute><AiTutorPage /></ProtectedRoute>} />
                <Route path="/lessons/:language?" element={<ProtectedRoute><LessonsListPage /></ProtectedRoute>} />
                <Route path="/lesson/:id" element={<ProtectedRoute><LessonDetailPage /></ProtectedRoute>} />
                <Route path="/stories/:language?" element={<ProtectedRoute><StoriesPage /></ProtectedRoute>} />
                <Route path="/story/:id" element={<ProtectedRoute><StoryReaderPage /></ProtectedRoute>} />
                <Route path="/quiz/:lessonId?" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
                <Route path="/quiz-results" element={<ProtectedRoute><QuizResultsPage /></ProtectedRoute>} />
                <Route path="/vision-ocr" element={<ProtectedRoute><VisionOcrPage /></ProtectedRoute>} />
                <Route path="/handwriting/:language?" element={<ProtectedRoute><HandwritingCanvasPage /></ProtectedRoute>} />
                <Route path="/personalized" element={<ProtectedRoute><PersonalizedLearningPage /></ProtectedRoute>} />
                <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
                <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
                <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardsPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationCenterPage /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><GlobalSearchPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

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
