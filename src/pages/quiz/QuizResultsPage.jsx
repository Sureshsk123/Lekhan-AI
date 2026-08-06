import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Award, CheckCircle2, XCircle, RefreshCw, ArrowRight, Sparkles, Trophy, Zap, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scorePct = 100, passed = true, xpEarned = 15, coinsEarned = 7, correctCount = 1, totalQuestions = 1, lessonId, languageCode = 'ta' } = location.state || {};

  useEffect(() => {
    if (passed) {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    }
  }, [passed]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-28 md:pb-8 min-w-0">
          <div className="glass-card p-6 sm:p-10 text-center space-y-6 border-slate-200 dark:border-slate-800">
            <div className={`w-20 h-20 rounded-3xl text-white flex items-center justify-center mx-auto shadow-2xl text-4xl animate-bounce ${
              passed ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-emerald-500/30' : 'bg-gradient-to-tr from-rose-500 to-amber-500 shadow-rose-500/30'
            }`}>
              {passed ? '🏆' : '💪'}
            </div>

            <div className="space-y-2">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                passed ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500'
              }`}>
                {passed ? 'Quiz Passed!' : 'Practice Needed'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 dark:text-white">
                {scorePct >= 80 ? 'Outstanding Score!' : passed ? 'Great Job!' : 'Keep Going!'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                You answered <strong className="text-slate-900 dark:text-white font-extrabold">{correctCount} of {totalQuestions}</strong> questions correctly ({scorePct}% score).
              </p>
            </div>

            {/* XP & Coins Reward Badge Banner */}
            {passed && (
              <div className="flex items-center justify-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 via-teal-500/10 to-amber-500/10 border border-blue-500/20 max-w-sm mx-auto">
                <div className="flex items-center gap-1.5 font-extrabold text-blue-500 text-sm">
                  <Zap className="w-5 h-5 fill-blue-500" />
                  <span>+{xpEarned} XP</span>
                </div>
                <div className="flex items-center gap-1.5 font-extrabold text-amber-500 text-sm">
                  <Coins className="w-5 h-5 fill-amber-500" />
                  <span>+{coinsEarned} Gems</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => navigate(lessonId ? `/quiz/${lessonId}` : `/lessons/${languageCode}`)}
                className="w-full sm:w-auto btn-secondary text-xs py-3 px-6 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Retry Quiz
              </button>

              <button
                onClick={() => navigate(`/lessons/${languageCode}`)}
                className="w-full sm:w-auto btn-primary text-xs py-3 px-6 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
              >
                <span>Continue Learning Path</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default QuizResultsPage;
