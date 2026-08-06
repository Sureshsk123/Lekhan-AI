import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Award, CheckCircle2, XCircle, ArrowRight, Volume2, Heart, Clock } from 'lucide-react';
import apiClient from '../../services/apiClient';
import confetti from 'canvas-confetti';

export const QuizPage = () => {
  const { lessonId = '' } = useParams();
  const [quiz, setQuiz] = useState(null); // full quiz object from backend
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]); // { questionId, answerId }[]
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [lives, setLives] = useState(5);
  const [timeLeft, setTimeLeft] = useState(45);
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuiz();
  }, [lessonId]);

  useEffect(() => {
    if (loading || feedback || !questions.length) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, loading, feedback, questions.length]);

  const playSynthSound = (isCorrect) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isCorrect ? 'sine' : 'sawtooth';
      osc.frequency.value = isCorrect ? 587.33 : 196;
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
      window.speechSynthesis.speak(utterance);
    }
  };

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      // Try to fetch quiz by lessonId (backend handles fallback to quiz lookup by lessonId)
      const res = await apiClient.get(`/v1/quizzes/${lessonId}`).catch(() => ({ data: null }));
      const quizData = res?.data?.data;

      if (quizData && quizData.questions && quizData.questions.length > 0) {
        setQuiz(quizData);
        setQuestions(quizData.questions);
      } else {
        // Demo fallback — local only, no backend submission
        setQuiz({ id: null, lessonId });
        setQuestions([
          {
            id: 'q1', type: 'MCQ',
            text: 'How do you say "Good Morning" in Tamil?',
            answers: [
              { id: 'a1', text: 'காலை வணக்கம்', isCorrect: true },
              { id: 'a2', text: 'மாலை வணக்கம்', isCorrect: false },
              { id: 'a3', text: 'நன்றி', isCorrect: false },
              { id: 'a4', text: 'போய் வருகிறேன்', isCorrect: false },
            ],
            explanation: '"காலை வணக்கம்" (Kaalai Vanakkam) means Good Morning in Tamil.',
          },
          {
            id: 'q2', type: 'MCQ',
            text: 'What does "நன்றி" (Nandri) mean?',
            answers: [
              { id: 'b1', text: 'Thank you', isCorrect: true },
              { id: 'b2', text: 'Hello', isCorrect: false },
              { id: 'b3', text: 'Goodbye', isCorrect: false },
              { id: 'b4', text: 'Please', isCorrect: false },
            ],
            explanation: '"நன்றி" (Nandri) is the Tamil word for "Thank you".',
          },
          {
            id: 'q3', type: 'MCQ',
            text: 'How do you introduce yourself in Tamil: "My name is ___"?',
            answers: [
              { id: 'c1', text: 'என் பெயர் ...', isCorrect: true },
              { id: 'c2', text: 'நான் வருகிறேன்', isCorrect: false },
              { id: 'c3', text: 'உங்கள் பெயர் என்ன?', isCorrect: false },
              { id: 'c4', text: 'நான் சாப்பிடுகிறேன்', isCorrect: false },
            ],
            explanation: '"என் பெயர்" (En peyar) means "My name is" in Tamil.',
          },
        ]);
      }
    } catch (err) {
      console.error('Fetch quiz error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAnswer = () => {
    if (!selectedOption) return;
    const currentQ = questions[currentIndex];

    // Determine correct answer — from backend (no isCorrect field for security) we don't know until submit,
    // but for fallback local questions we have isCorrect. For backend questions, treat any selection as continue.
    const isLocalCorrect = selectedOption.isCorrect !== undefined ? selectedOption.isCorrect : null;

    if (isLocalCorrect === false) {
      setLives((prev) => Math.max(0, prev - 1));
      playSynthSound(false);
      setFeedback({ isCorrect: false, explanation: currentQ.explanation || 'Not quite! Review and try again.' });
    } else {
      playSynthSound(true);
      if (isLocalCorrect === true) confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      setFeedback({ isCorrect: true, explanation: 'Great answer!' });
    }
  };

  const handleNextQuestion = async () => {
    const currentQ = questions[currentIndex];
    const newAnswers = [...answers, { questionId: currentQ.id, answerId: selectedOption.id }];
    setAnswers(newAnswers);
    setSelectedOption(null);
    setFeedback(null);
    setTimeLeft(45);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz finished — submit to backend if we have a real quiz ID
      let scorePct = 0;
      let passed = false;
      let xpEarned = 25;
      let coinsEarned = 0;
      let correctCount = 0;
      let serverLessonId = lessonId;

      if (quiz?.id) {
        // Real quiz: submit answers to backend
        try {
          const submitRes = await apiClient.post(`/v1/quizzes/${quiz.id}/attempt`, { answers: newAnswers });
          const result = submitRes.data?.data;
          if (result) {
            scorePct = result.score;
            passed = result.passed;
            xpEarned = result.xpEarned || 25;
            coinsEarned = result.coinsEarned || 0;
            correctCount = result.correctCount || 0;
            serverLessonId = result.lessonId || lessonId;
          }
        } catch (err) {
          console.error('Quiz submit error:', err);
        }
      } else {
        // Local fallback: calculate locally
        correctCount = newAnswers.filter((a, idx) => questions[idx]?.answers?.find(o => o.id === a.answerId)?.isCorrect).length;
        scorePct = Math.round((correctCount / questions.length) * 100);
        passed = scorePct >= 60;
        xpEarned = passed ? 15 : 0;
        coinsEarned = passed ? 7 : 0;
      }

      navigate('/quiz-results', {
        state: {
          scorePct,
          passed,
          xpEarned,
          coinsEarned,
          correctCount,
          totalQuestions: questions.length,
          lessonId: serverLessonId,
          languageCode: quiz?.lesson?.topic?.module?.course?.language?.code || 'ta',
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-400">Loading Quiz...</span>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-28 md:pb-8 min-w-0 flex flex-col">
          {/* Header Progress, Timer & Lives */}
          <div className="glass-card p-4 sm:p-5 border-slate-200 dark:border-slate-800 space-y-3 shrink-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-extrabold text-slate-600 dark:text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>

              {/* Timer Badge */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold transition-colors ${
                timeLeft <= 10 
                  ? 'bg-rose-500/15 text-rose-500 animate-pulse border border-rose-500/30' 
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
              </div>

              {/* Lives / Hearts */}
              <div className="flex items-center gap-1 text-rose-500 font-extrabold text-xs">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Heart key={i} className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform hover:scale-110 ${i < lives ? 'fill-rose-500 text-rose-500' : 'text-slate-300 dark:text-slate-700'}`} />
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-teal-400 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-card p-5 sm:p-8 md:p-10 space-y-6 border-slate-200 dark:border-slate-800 flex flex-col justify-between flex-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-blue-500 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                  {currentQ?.type || 'MULTIPLE CHOICE'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-heading text-slate-900 dark:text-white leading-snug">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
              {currentQ?.answers?.map((opt) => {
                const isSelected = selectedOption?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => { if (!feedback) setSelectedOption(opt); }}
                    className={`p-4 sm:p-5 rounded-2xl text-left text-sm sm:text-base font-bold transition-all border-2 flex items-center justify-between gap-3 min-h-[64px] ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10 scale-[1.01]'
                        : 'border-slate-200/80 dark:border-slate-700/80 bg-white/60 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="leading-relaxed break-words">{opt.text}</span>
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
                  className="btn-primary text-xs sm:text-sm py-3.5 px-8 shadow-xl shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  Check Answer
                </button>
              </div>
            ) : (
              <div className={`p-5 rounded-2xl border space-y-3 animate-in fade-in ${
                feedback.isCorrect
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                    {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                    {feedback.isCorrect ? 'Correct! Great job!' : 'Incorrect'}
                  </span>
                  <button
                    onClick={handleNextQuestion}
                    className="btn-primary text-xs sm:text-sm py-3 px-6 shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">{feedback.explanation}</p>
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
