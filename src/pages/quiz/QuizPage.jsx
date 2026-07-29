import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { Award, CheckCircle2, XCircle, ArrowRight, Sparkles, Volume2 } from 'lucide-react';
import { generateQuiz, submitQuiz } from '../../services/quizService';

export const QuizPage = () => {
  const { lessonId = 'ai-dynamic-quiz' } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuiz();
  }, [lessonId]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await generateQuiz(lessonId);
      if (res && res.data && res.data.questions) {
        setQuestions(res.data.questions);
      } else {
        // Fallback removed as per instructions
        setQuestions([]);
        console.warn('No questions returned from API');
      }
    } catch (err) {
      console.error('Fetch quiz error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;

    const newAnswers = [...answers, { question: currentQ.question, selected: selectedOption, correct: currentQ.correctAnswer, isCorrect }];
    setAnswers(newAnswers);
    setSelectedOption(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate score & submit
      const scorePct = Math.round((newAnswers.filter(a => a.isCorrect).length / questions.length) * 100);
      const xpEarned = Math.round((scorePct / 100) * 50);

      submitQuiz({
        lessonId,
        score: scorePct,
        answers: newAnswers
      }).catch(() => {});

      navigate('/quiz-results', { state: { scorePct, xpEarned, answers: newAnswers } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex max-w-4xl mx-auto w-full">
          <Sidebar />
          <main className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-4">
              <XCircle className="w-16 h-16 text-slate-400 mx-auto" />
              <h2 className="text-xl font-bold">Failed to load quiz</h2>
              <p className="text-slate-500">Could not generate questions. Please try again later.</p>
              <button onClick={() => navigate(-1)} className="px-6 py-2 bg-emerald-500 text-white rounded-xl">Go Back</button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-4xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-hidden pb-24 lg:pb-12">
          <Breadcrumbs />

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span>{progressPct}% Complete</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <GlassCard className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-snug">
                {currentQ?.question}
              </h2>
            </div>

            <div className="space-y-3 pt-2">
              {currentQ?.options?.map((opt, i) => {
                const selected = selectedOption === opt;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedOption(opt)}
                    className={`w-full p-4 rounded-2xl text-left text-sm font-bold transition-all border-2 flex items-center justify-between ${
                      selected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-md scale-[1.01]'
                        : 'border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span>{opt}</span>
                    {selected && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleNext}
                disabled={selectedOption === null}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                <span>{currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </GlassCard>

        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default QuizPage;
