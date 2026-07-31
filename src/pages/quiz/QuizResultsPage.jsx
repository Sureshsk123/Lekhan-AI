import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import GlassCard from '../../components/common/GlassCard';
import { Award, CheckCircle2, XCircle, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';

export const QuizResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { scorePct = 0, passed = false, xpEarned = 0, coinsEarned = 0, questionResults = [], quizId, lessonId } = location.state || {};

  return (
    <div className="min-h-screen bg-transparent text-content-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-4xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          
          <GlassCard className="p-8 text-center space-y-6">
            <div className={`w-20 h-20 rounded-full text-white flex items-center justify-center mx-auto shadow-xl shadow-sm text-4xl animate-bounce ${passed ? 'bg-emerald-500' : 'bg-rose-500'}`}>
              {passed ? '🎉' : '💪'}
            </div>

            <div>
              <span className={`text-xs font-black uppercase tracking-widest ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {passed ? 'Quiz Passed!' : 'Quiz Failed'}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white mt-1">
                {scorePct >= 80 ? 'Outstanding Job!' : passed ? 'Good Effort!' : 'Keep Practicing!'}
              </h1>
              <p className="text-sm text-content-tertiary mt-2">
                You scored <strong className={passed ? "text-emerald-500 font-black" : "text-rose-500 font-black"}>{scorePct}%</strong>.
                {passed 
                  ? ' Great work! Your progress has been saved.' 
                  : ' You need at least 60% to pass. Try again!'}
              </p>
              {passed && (xpEarned > 0 || coinsEarned > 0) && (
                <div className="flex items-center justify-center gap-4 mt-3">
                  {xpEarned > 0 && (
                    <span className="text-sm font-bold text-amber-500">⚡ +{xpEarned} XP</span>
                  )}
                  {coinsEarned > 0 && (
                    <span className="text-sm font-bold text-yellow-600">🪙 +{coinsEarned} Coins</span>
                  )}
                </div>
              )}
            </div>

            {/* Answer Breakdown */}
            <div className="text-left space-y-3 pt-4 border-t border-border-light/60">
              <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Answer Breakdown</h3>
              {questionResults.map((q, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-surface-tertiary/70 flex items-start gap-3 text-xs">
                  {q.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{q.questionText}</p>
                    {!q.isCorrect && (
                      <p className="text-slate-500 mt-0.5">Correct Answer: <span className="text-emerald-500 font-bold">{q.correctAnswerText || 'Unknown'}</span></p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {lessonId ? (
                <button
                  onClick={() => navigate(`/lesson/${lessonId}`)}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>{passed ? 'Continue Learning' : 'Return to Lesson'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}
              <button
                onClick={() => navigate('/lessons/tamil')}
                className="px-6 py-3 rounded-2xl bg-accent-primary text-white font-bold text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Back to Learning Path</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-2xl bg-surface-tertiary text-slate-800 dark:text-white font-bold text-sm border border-border-light hover:bg-slate-200 transition-all"
              >
                Dashboard
              </button>
            </div>

          </GlassCard>

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default QuizResultsPage;
