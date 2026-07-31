import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import Breadcrumbs from '../../components/layout/Breadcrumbs';
import GlassCard from '../../components/common/GlassCard';
import { Volume2, ArrowRight, CheckCircle2, BookOpen, Pencil, MessageSquare, Brain, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5005/api';

const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

export const LessonDetailPage = () => {
  const { id } = useParams();
  const [lesson, setLesson]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vocab');
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted]   = useState(false);
  const [hasPassedQuiz, setHasPassedQuiz] = useState(true);
  const [reward, setReward]         = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchLesson(); }, [id]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/v1/lessons/details/${id}`, {
        headers: authHeader()
      });
      if (res.data?.data) {
        setLesson(res.data.data);
        setCompleted(res.data.data.isCompleted || false);
        setHasPassedQuiz(res.data.data.hasPassedQuiz !== false);
      }
    } catch (err) {
      console.error('Lesson fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (completing || completed) return;
    setCompleting(true);
    try {
      const res = await axios.post(
        `${API_URL}/v1/lessons/complete/${id}`,
        {},
        { headers: authHeader() }
      );
      if (res.data?.data) {
        setReward(res.data.data);
        setCompleted(true);
        // Navigate to next lesson after short delay if available
        const nextId = res.data.data.nextLessonId;
        if (nextId) {
          setTimeout(() => navigate(`/lesson/${nextId}`), 1800);
        }
      }
    } catch (err) {
      console.error('Complete lesson error:', err);
    } finally {
      setCompleting(false);
    }
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Extract exercises by type
  const getExerciseByType = (type) =>
    lesson?.exercises?.find(ex => ex.type === type)?.content;

  const vocabContent  = getExerciseByType('VOCABULARY');
  const grammarContent = getExerciseByType('GRAMMAR');
  const examplesContent = getExerciseByType('EXAMPLES');
  const primaryQuiz   = lesson?.quizzes?.[0];

  const tabs = [
    { id: 'vocab',   label: 'Vocabulary', icon: BookOpen,      show: !!vocabContent },
    { id: 'grammar', label: 'Grammar',    icon: Brain,         show: !!grammarContent },
    { id: 'examples',label: 'Examples',   icon: MessageSquare, show: !!examplesContent },
    { id: 'quiz',    label: 'Quiz',       icon: Pencil,        show: !!primaryQuiz },
  ].filter(t => t.show);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-content-primary mb-2">Lesson not found</h2>
            <button onClick={() => navigate(-1)} className="text-sm text-emerald-600 underline">Go back</button>
          </div>
        </div>
      </div>
    );
  }

  const langCode = lesson.topic?.module?.course?.language?.code || 'en';

  return (
    <div className="min-h-screen bg-transparent text-content-primary flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto pb-24 lg:pb-12">
          <Breadcrumbs />

          {/* Header */}
          <div className="relative overflow-hidden p-6 rounded-2xl bg-emerald-600 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                {lesson.type}
              </span>
              <span className="text-sm font-bold text-yellow-300">⚡ +{lesson.xpReward} XP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{lesson.title}</h1>
            {lesson.content && (
              <p className="text-sm text-emerald-100 mt-2 max-w-2xl">{lesson.content}</p>
            )}
          </div>

          {/* Reward Banner */}
          {completed && reward && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-medium">
                Lesson complete! You earned <strong>+{reward.xpEarned} XP</strong> and <strong>+{reward.coinsEarned} coins</strong>.
              </span>
            </div>
          )}

          {/* Tabs */}
          {tabs.length > 0 && (
            <div className="flex gap-2 border-b border-border-light overflow-x-auto pb-0">
              {tabs.map(({ id: tabId, label, icon: Icon }) => (
                <button
                  key={tabId}
                  onClick={() => setActiveTab(tabId)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold capitalize whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tabId
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-content-secondary hover:text-content-primary'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Vocabulary Tab */}
          {activeTab === 'vocab' && vocabContent?.words && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vocabContent.words.map((v, i) => (
                <GlassCard key={i} className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {v.transliteration && (
                        <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{v.transliteration}</span>
                      )}
                      <p className="text-sm font-semibold text-content-secondary mt-0.5">{v.word}</p>
                    </div>
                    <button
                      onClick={() => playAudio(v.word)}
                      className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 hover:scale-110 transition-transform shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-content-primary mb-1">{v.meaning}</p>
                  {v.example && (
                    <p className="text-xs text-content-tertiary italic">"{v.example}"</p>
                  )}
                </GlassCard>
              ))}
            </div>
          )}

          {/* Grammar Tab */}
          {activeTab === 'grammar' && grammarContent && (
            <div className="space-y-4">
              <GlassCard className="p-6">
                <h3 className="text-sm font-bold text-content-secondary uppercase tracking-wide mb-3">Rule</h3>
                <p className="text-base text-content-primary leading-relaxed">{grammarContent.rule}</p>
              </GlassCard>
              {grammarContent.examples?.length > 0 && (
                <GlassCard className="p-6">
                  <h3 className="text-sm font-bold text-content-secondary uppercase tracking-wide mb-3">Examples</h3>
                  <ul className="space-y-2">
                    {grammarContent.examples.map((ex, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-content-primary">
                        <ChevronRight className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              )}
            </div>
          )}

          {/* Examples Tab */}
          {activeTab === 'examples' && examplesContent?.sentences && (
            <div className="space-y-3">
              {examplesContent.sentences.map((s, i) => (
                <GlassCard key={i} className="p-4 flex items-start gap-3">
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-content-primary leading-relaxed">{s}</p>
                </GlassCard>
              ))}
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === 'quiz' && primaryQuiz && (
            <GlassCard className="p-6 text-center space-y-4">
              <Brain className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-content-primary">{primaryQuiz.title}</h3>
              <p className="text-sm text-content-secondary">
                {primaryQuiz._count?.questions || 0} questions · Tests your understanding of this lesson
              </p>
              <button
                onClick={() => navigate(`/quiz/${primaryQuiz.id}`)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 transition-colors"
              >
                Start Quiz <ArrowRight className="w-4 h-4" />
              </button>
            </GlassCard>
          )}

          {/* Complete & Continue */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleComplete}
              disabled={completing || completed || !hasPassedQuiz}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm transition-all ${
                completed
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                  : !hasPassedQuiz
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
              }`}
            >
              {completing
                ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : completed
                ? <><CheckCircle2 className="w-4 h-4" /> Completed</>
                : !hasPassedQuiz
                ? 'Pass Quiz to Complete Lesson'
                : 'Mark as Complete'
              }
            </button>

            {primaryQuiz && !completed && (
              <button
                onClick={() => navigate(`/quiz/${primaryQuiz.id}`)}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-content-primary text-surface-primary font-bold text-sm hover:bg-accent-secondary transition-all"
              >
                Take Quiz <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {completed && (
              <button
                onClick={() => {
                  const lang = lesson.topic?.module?.course?.language?.code || 'tamil';
                  navigate(`/lessons/${lang}`);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-sm hover:bg-emerald-200 transition-all border border-emerald-300"
              >
                Learning Path <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default LessonDetailPage;
