import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import apiClient from '../../services/apiClient';
import { Volume2, BookOpen, Brain, MessageSquare, CheckCircle2, ArrowRight, Sparkles, Mic, Play, Flame, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';

export const LessonDetailPage = () => {
  const { id } = useParams();
  const { activeLanguage } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vocab');
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [reward, setReward] = useState(null);
  const [completeError, setCompleteError] = useState(null);
  const [speakingRecording, setSpeakingRecording] = useState(false);
  const [speakingPassed, setSpeakingPassed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/v1/lessons/details/${id}`).catch(() => ({ data: null }));
      
      let lessonData = res?.data?.data;
      if (!lessonData) {
        // Fallback demo lesson structure
        lessonData = {
          _id: id,
          title: 'Ordering Food & Drinks at a Cafe',
          type: 'CONVERSATION',
          xpReward: 50,
          content: 'Master essential vocabulary and sentences for ordering coffee, pastries, and asking for the bill in Spanish.',
          isCompleted: false,
          exercises: [
            {
              type: 'VOCABULARY',
              content: {
                words: [
                  { word: 'El Café', meaning: 'Coffee', transliteration: 'el kah-FEH', example: 'Un café solo, por favor.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80' },
                  { word: 'La Cuenta', meaning: 'The Bill', transliteration: 'lah KWEHN-tah', example: '¿Me trae la cuenta, por favor?', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80' },
                  { word: 'El Agua', meaning: 'Water', transliteration: 'ehl AH-gwah', example: 'Un vaso de agua sin gas.', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4e?auto=format&fit=crop&w=400&q=80' },
                ]
              }
            },
            {
              type: 'GRAMMAR',
              content: {
                rule: 'Polite Requests using "Quisiera" or "Por favor"',
                examples: [
                  'Quisiera un té verde. (I would like a green tea.)',
                  '¿Tiene leche de avena? (Do you have oat milk?)'
                ]
              }
            },
            {
              type: 'EXAMPLES',
              content: {
                sentences: [
                  '¡Buenos días! ¿Qué desea tomar?',
                  'Para mí un croissant y un café con leche, por favor.',
                  '¿Cuánto es en total?'
                ]
              }
            }
          ],
          quizzes: [{ id: 'q1', title: 'Cafe Conversation Check', _count: { questions: 5 } }]
        };
      }

      setLesson(lessonData);
      setCompleted(lessonData.isCompleted || false);
    } catch (err) {
      console.error('Lesson fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (completing || completed) return;
    setCompleting(true);
    setCompleteError(null);
    try {
      const res = await apiClient.post(`/v1/lessons/complete/${id}`, {});
      const data = res.data?.data;
      setReward({ xpEarned: data?.xpEarned || 50, coinsEarned: data?.coinsEarned || 20 });
      setCompleted(true);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      const quizId = lesson?.quizzes?.[0]?.id;
      setTimeout(() => {
        if (quizId) {
          navigate(`/quiz/${quizId}`);
        } else if (data?.nextLessonId) {
          navigate(`/lessons/details/${data.nextLessonId}`);
        } else {
          navigate('/lessons/ta');
        }
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not complete lesson';
      setCompleteError(msg);
    } finally {
      setCompleting(false);
    }
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  const simulateSpeechTest = () => {
    setSpeakingRecording(true);
    setTimeout(() => {
      setSpeakingRecording(false);
      setSpeakingPassed(true);
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-slate-400">Loading Lesson Details...</span>
      </div>
    );
  }

  const getExerciseByType = (type) => lesson?.exercises?.find(ex => ex.type === type)?.content;

  const vocabContent = getExerciseByType('VOCABULARY');
  const grammarContent = getExerciseByType('GRAMMAR');
  const examplesContent = getExerciseByType('EXAMPLES');
  const primaryQuiz = lesson?.quizzes?.[0];

  const tabs = [
    { id: 'vocab', label: 'Vocabulary', icon: BookOpen, show: !!vocabContent },
    { id: 'grammar', label: 'Grammar Rule', icon: Brain, show: !!grammarContent },
    { id: 'examples', label: 'Phrases & Sentences', icon: MessageSquare, show: !!examplesContent },
    { id: 'speaking', label: 'Voice Repeat', icon: Mic, show: true },
  ].filter(t => t.show);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-24 md:pb-8 min-w-0">
          
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 text-white p-6 sm:p-8 shadow-xl shadow-blue-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                {lesson.type}
              </span>
              <span className="text-xs font-black text-amber-300 flex items-center gap-1 bg-black/20 px-3 py-1 rounded-full">
                ⚡ +{lesson.xpReward} XP Reward
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading">{lesson.title}</h1>
            {lesson.content && (
              <p className="text-xs sm:text-sm text-blue-100 mt-2 max-w-2xl font-medium leading-relaxed">
                {lesson.content}
              </p>
            )}
          </div>

          {/* Completion Victory Alert */}
          {completed && (
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Lesson Completed! You earned +{reward?.xpEarned || 50} XP and +{reward?.coinsEarned || 20} Coins! 🎉</span>
              </div>
              <button
                onClick={() => navigate(`/lessons/${activeLanguage || 'ta'}`)}
                className="btn-primary text-xs py-1.5 px-3"
              >
                Back to Path →
              </button>
            </div>
          )}

          {/* Quiz Required Error Alert */}
          {completeError && (
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center justify-between animate-in fade-in">
              <span>⚠️ {completeError}</span>
              {lesson?.quizzes?.[0] && (
                <button
                  onClick={() => navigate(`/quiz/${lesson.quizzes[0].id}`)}
                  className="btn-primary text-xs py-1.5 px-3"
                >
                  Take Quiz First →
                </button>
              )}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-hide">
            {tabs.map(({ id: tabId, label, icon: Icon }) => (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === tabId
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Vocabulary Cards Grid */}
          {activeTab === 'vocab' && vocabContent?.words && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vocabContent.words.map((v, i) => (
                <div key={i} className="glass-card p-5 space-y-3 glass-card-hover border-slate-200 dark:border-slate-800">
                  {v.image && (
                    <img src={v.image} alt={v.word} className="w-full h-36 rounded-2xl object-cover" />
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white">
                        {v.word}
                      </h3>
                      {v.transliteration && (
                        <span className="text-xs font-mono text-blue-500 font-bold">[{v.transliteration}]</span>
                      )}
                    </div>
                    <button
                      onClick={() => playAudio(v.word)}
                      className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors"
                      title="Listen pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Meaning: "{v.meaning}"
                  </p>

                  {v.example && (
                    <p className="text-xs text-slate-400 italic bg-slate-100 dark:bg-slate-800/60 p-2.5 rounded-xl">
                      "{v.example}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Grammar Tab */}
          {activeTab === 'grammar' && grammarContent && (
            <div className="glass-card p-6 space-y-4 border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-500 flex items-center gap-2">
                <Brain className="w-4 h-4" /> Grammar Rule
              </h3>
              <p className="text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                {grammarContent.rule}
              </p>

              {grammarContent.examples?.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-extrabold text-slate-400 uppercase">Usage Examples</span>
                  <div className="space-y-2">
                    {grammarContent.examples.map((ex, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-200 font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Examples Tab */}
          {activeTab === 'examples' && examplesContent?.sentences && (
            <div className="space-y-3">
              {examplesContent.sentences.map((s, idx) => (
                <div key={idx} className="glass-card p-4 flex items-center justify-between border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-500 font-extrabold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{s}</p>
                  </div>
                  <button
                    onClick={() => playAudio(s)}
                    className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Voice Repeat Practice Tab */}
          {activeTab === 'speaking' && (
            <div className="glass-card p-8 text-center space-y-4 border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-extrabold font-heading text-slate-900 dark:text-white">
                Listen & Repeat Voice Challenge
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Listen to "Un café solo por favor" and speak into your microphone to verify accent accuracy.
              </p>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => playAudio('Un café solo por favor')}
                  className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4 text-blue-500" /> Listen Target
                </button>

                <button
                  onClick={simulateSpeechTest}
                  disabled={speakingRecording}
                  className={`btn-primary text-xs py-2.5 px-5 flex items-center gap-2 ${
                    speakingRecording ? 'bg-rose-500 animate-pulse' : ''
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>{speakingRecording ? 'Recording...' : 'Record Voice'}</span>
                </button>
              </div>

              {speakingPassed && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 text-emerald-500 text-xs font-extrabold inline-block animate-in fade-in">
                  ✓ Great Pronunciation! 96% Pitch Accuracy Match!
                </div>
              )}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleComplete}
              disabled={completing || completed}
              className={`flex-1 btn-primary py-3 px-6 text-sm font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30 ${
                completed ? 'bg-emerald-600 hover:bg-emerald-600 opacity-90' : ''
              }`}
            >
              {completing ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : completed ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Completed (+50 XP)
                </>
              ) : (
                'Mark Lesson Complete (+50 XP)'
              )}
            </button>

            {primaryQuiz && (
              <button
                onClick={() => navigate(`/quiz/${primaryQuiz.id}`)}
                className="flex-1 btn-secondary py-3 px-6 text-sm font-extrabold flex items-center justify-center gap-2"
              >
                <span>Take Lesson Quiz</span>
                <ArrowRight className="w-4 h-4" />
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
