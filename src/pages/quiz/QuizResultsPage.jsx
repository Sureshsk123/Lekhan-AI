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
  const { scorePct = 100, xpEarned = 50, answers = [] } = location.state || {};

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-4xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          
          <GlassCard className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 text-white flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 text-4xl animate-bounce">
              🎉
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Quiz Completed
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-800 dark:text-white mt-1">
                {scorePct >= 80 ? 'Outstanding Job!' : 'Good Effort!'}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                You scored <strong className="text-emerald-500 font-black">{scorePct}%</strong> accuracy and earned <strong className="text-amber-500 font-black">⚡ +{xpEarned} XP</strong>!
              </p>
            </div>

            {/* Answer Breakdown */}
            <div className="text-left space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
              <h3 className="font-extrabold text-sm text-slate-400 uppercase tracking-wider">Answer Breakdown</h3>
              {answers.map((a, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 flex items-start gap-3 text-xs">
                  {a.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white">{a.question}</p>
                    <p className="text-slate-500 mt-0.5">Your answer: <span className={a.isCorrect ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>{a.selected}</span></p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/lessons/tamil')}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Continue Lessons</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-200 transition-all"
              >
                Back to Dashboard
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
