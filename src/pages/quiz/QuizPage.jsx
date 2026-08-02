import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Award, CheckCircle2, XCircle, ArrowRight, Sparkles, Volume2, Heart, Mic, RefreshCw } from 'lucide-react';
import { generateQuiz, submitQuiz } from '../../services/quizService';
import apiClient from '../../services/apiClient';
import confetti from 'canvas-confetti';

export const QuizPage = () => {
  const { lessonId = 'spanish' } = useParams();
  const [questions, setQuestions] = useState([]);
  const [actualLessonId, setActualLessonId] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, explanation: string }
  const [lives, setLives] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuiz();
  }, [lessonId]);

  const playSynthSound = (isCorrect) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isCorrect ? 'sine' : 'sawtooth';
      osc.frequency.value = isCorrect ? 587.33 : 196; // D5 vs G3
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  };

  const playTTS = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const res = await generateQuiz(lessonId).catch(() => ({ data: null }));
      let fetchedQ = res?.data?.questions;

      if (!fetchedQ || fetchedQ.length === 0) {
        // Duolingo-style fallback quiz questions
        fetchedQ = [
          {
            id: 'q1',
            type: 'MCQ',
            text: 'How do you say "Good Morning" in Spanish?',
            answers: [
              { id: 'a1', text: '¡Buenos días!', isCorrect: true },
              { id: 'a2', text: '¡Buenas noches!', isCorrect: false },
              { id: 'a3', text: '¡Muchas gracias!', isCorrect: false },
              { id: 'a4', text: '¡Hasta luego!', isCorrect: false },
            ],
            explanation: '“Buenos días” is used in the morning until noon.',
          },
          {
            id: 'q2',
            type: 'LISTEN',
            text: 'Listen and select the correct English translation:',
            audioText: 'Por favor, ¿cuánto cuesta esto?',
            answers: [
              { id: 'b1', text: 'Please, how much does this cost?', isCorrect: true },
              { id: 'b2', text: 'Where is the nearest train station?', isCorrect: false },
              { id: 'b3', text: 'Could I have a glass of water?', isCorrect: false },
              { id: 'b4', text: 'What is your name?', isCorrect: false },
            ],
            explanation: '“¿Cuánto cuesta esto?” translates directly to "How much does this cost?".',
          },
          {
            id: 'q3',
            type: 'FILL_BLANK',
            text: 'Complete the sentence: "Yo _____ un café solo, por favor."',
            answers: [
              { id: 'c1', text: 'quisiera', isCorrect: true },
              { id: 'c2', text: 'hablar', isCorrect: false },
              { id: 'c3', text: 'mañana', isCorrect: false },
              { id: 'c4', text: 'gracias', isCorrect: false },
            ],
            explanation: '“Quisiera” means "I would like".',
          },
        ];
      }

      setQuestions(fetchedQ);
    } catch (err) {
      console.error('Fetch quiz error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption.isCorrect !== undefined ? selectedOption.isCorrect : true;

    playSynthSound(isCorrect);

    if (isCorrect) {
      setFeedback({ isCorrect: true, explanation: 'Awesome job! Perfect answer.' });
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } else {
      setLives((prev) => Math.max(0, prev - 1));
      setFeedback({
        isCorrect: false,
        explanation: currentQ.explanation || 'Incorrect answer. Try keeping this in mind for review!',
      });
    }
  };

  const handleNextQuestion = async () => {
    const currentQ = questions[currentIndex];
    const newAnswers = [...answers, { questionId: currentQ.id, answerId: selectedOption.id }];
    setAnswers(newAnswers);
    setSelectedOption(null);
    setFeedback(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finished Quiz
      const correctCount = newAnswers.filter((a, idx) => questions[idx]?.answers?.find(opt => opt.id === a.answerId)?.isCorrect).length;
      const scorePct = Math.round((correctCount / questions.length) * 100);
      const passed = scorePct >= 60;

      submitQuiz(lessonId, { answers: newAnswers }).catch(() => {});

      navigate('/quiz-results', {
        state: {
          scorePct,
          passed,
          xpEarned: passed ? 100 : 25,
          coinsEarned: passed ? 30 : 0,
          correctCount,
          totalQuestions: questions.length,
          lessonId,
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-400">Building Duolingo-style Quiz...</span>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-24 md:pb-8 min-w-0">
          {/* Header Progress & Lives */}
          <div className="glass-card p-4 border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-500">
                Question {currentIndex + 1} of {questions.length}
              </span>

              <div className="flex items-center gap-1 text-rose-500 font-extrabold text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart key={i} className={`w-4 h-4 ${i < lives ? 'fill-rose-500' : 'text-slate-300 dark:text-slate-700'}`} />
                ))}
              </div>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-teal-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-card p-8 space-y-6 border-slate-200 dark:border-slate-800">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 px-2.5 py-1 rounded-full bg-blue-500/10">
                {currentQ?.type || 'MULTIPLE CHOICE'}
              </span>

              <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white leading-snug">
                {currentQ?.text}
              </h2>

              {currentQ?.audioText && (
                <button
                  onClick={() => playTTS(currentQ.audioText)}
                  className="mt-2 inline-flex items-center gap-2 btn-primary text-xs py-2 px-4 shadow-md"
                >
                  <Volume2 className="w-4 h-4" /> Listen Audio
                </button>
              )}
            </div>

            {/* Answer Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ?.answers?.map((opt) => {
                const isSelected = selectedOption?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => { if (!feedback) setSelectedOption(opt); }}
                    className={`p-4 rounded-2xl text-left text-sm font-bold transition-all border-2 flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-md scale-[1.01]'
                        : 'border-slate-200/80 dark:border-slate-700/80 bg-white/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-blue-400'
                    }`}
                  >
                    <span>{opt.text}</span>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Check / Next Action Footer */}
            {!feedback ? (
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className="btn-primary text-xs py-3 px-6 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                  Check Answer
                </button>
              </div>
            ) : (
              <div className={`p-4 rounded-2xl border space-y-3 animate-in fade-in ${
                feedback.isCorrect
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm flex items-center gap-2">
                    {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-rose-500" />}
                    {feedback.isCorrect ? 'Correct! +15 XP' : 'Incorrect'}
                  </span>
                  <button
                    onClick={handleNextQuestion}
                    className="btn-primary text-xs py-2.5 px-5 shadow-md flex items-center gap-2"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs font-medium leading-relaxed">{feedback.explanation}</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default QuizPage;
