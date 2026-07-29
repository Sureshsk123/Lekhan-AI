import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Pencil, Mic, Headphones, Award, Sparkles, CheckCircle, ArrowLeft, Volume2, Play } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const LessonDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { API_URL, user } = useAuth();
    const [lesson, setLesson] = useState(null);
    const [activeTab, setActiveTab] = useState('reading');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [quizAnswers, setQuizAnswers] = useState({});

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await axios.get(`${API_URL}/lessons/${user?.enrolledLanguages?.[0] || 'tamil'}/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.data.success) {
                    setLesson(response.data.lesson);
                }
            } catch (error) {
                console.error('Error fetching lesson:', error);
            }
        };
        fetchLesson();
    }, [id, API_URL, user]);

    const tabs = [
        { id: 'reading', label: 'Reading', icon: BookOpen },
        { id: 'writing', label: 'Writing', icon: Pencil },
        { id: 'speaking', label: 'Speaking', icon: Mic },
        { id: 'listening', label: 'Listening', icon: Headphones }
    ];

    // Pre-warm the speech engine
    useEffect(() => {
        const loadVoices = () => {
            window.speechSynthesis.getVoices();
        };
        loadVoices();
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const handlePlayAudio = (text) => {
        if (!text) return;

        setIsPlaying(true);
        const lang = lesson?.language === 'tamil' ? 'ta' : 'en';

        // Safety Reset: Stop anything currently playing
        window.speechSynthesis.cancel();

        // Use the Backend Bridge (Most Reliable AI Model)
        // This streams high-quality AI speech through our server to avoid browser blocks
        const audioUrl = `${API_URL}/lessons/tts?text=${encodeURIComponent(text)}&lang=${lang}`;
        const audio = new Audio(audioUrl);

        // Safety: If audio takes too long or fails, reset button
        const safetyTimeout = setTimeout(() => setIsPlaying(false), 8000);

        audio.play()
            .then(() => {
                audio.onended = () => {
                    clearTimeout(safetyTimeout);
                    setIsPlaying(false);
                };
            })
            .catch(error => {
                console.warn('AI Bridge failed, using System Fallback...', error);

                // FINAL FALLBACK: Native Speech Synthesis
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-US';
                utterance.onend = () => {
                    clearTimeout(safetyTimeout);
                    setIsPlaying(false);
                };
                window.speechSynthesis.speak(utterance);
            });
    };

    const recognitionRef = React.useRef(null);

    React.useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = 'ta-IN';
            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setIsRecording(false);
                if (transcript.includes('அ') || transcript.toLowerCase().includes('ah')) {
                    alert('Excellent! Correct pronunciation! 🌟');
                } else {
                    alert(`I heard "${transcript}". Try saying it again!`);
                }
            };
            recognitionRef.current.onend = () => setIsRecording(false);
            recognitionRef.current.onerror = () => setIsRecording(false);
        }
    }, []);

    const handleStartRecording = () => {
        if (!recognitionRef.current) {
            alert('Voice recording not supported in this browser.');
            return;
        }
        setIsRecording(true);
        recognitionRef.current.start();
    };

    if (!lesson) return <div className="min-h-screen flex items-center justify-center bg-forest-50"><div className="w-16 h-16 border-4 border-forest-500 border-t-transparent rounded-full animate-spin"></div></div>;

    const handleStartQuiz = () => {
        navigate(`/quiz/${id}`);
    };

    const writingChar = lesson.content?.writing?.[0]?.character || lesson.title?.[0] || '📖';

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-forest-50/30">
            <div className="max-w-6xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-gradient child-font text-center mb-8"
                >
                    Lesson {lesson.lessonNumber}: {lesson.title}
                </motion.h1>

                {/* Tabs - Only show tabs if content exists */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {tabs.map(tab => {
                        // Optional: Hide tabs if data is completely missing
                        if (tab.id === 'writing' && !lesson.content?.writing?.length) return null;
                        if (tab.id === 'listening' && !lesson.content?.listening?.length) return null;

                        return (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.05 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-full font-semibold flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-forest-500 to-forest-600 text-white shadow-lg'
                                    : 'glass text-gray-700'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </motion.button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="card shadow-2xl overflow-hidden border-0 bg-white/80 backdrop-blur-sm">
                    {activeTab === 'reading' && (
                        <div className="p-8">
                            <div className="text-center mb-12">
                                {lesson.content?.reading?.image && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="mb-8 flex justify-center"
                                    >
                                        <img
                                            src={lesson.content.reading.image}
                                            alt={lesson.title}
                                            className="w-80 h-80 object-contain rounded-[3rem] shadow-2xl bg-white p-4 border-8 border-forest-50"
                                        />
                                    </motion.div>
                                )}
                                <div className="text-[12rem] mb-4 font-tamil text-forest-600 drop-shadow-lg leading-none">
                                    {writingChar}
                                </div>
                                <h2 className="text-5xl font-black mb-4 child-font text-gray-800 tracking-tight">
                                    {lesson.title}
                                </h2>
                                <p className="text-3xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
                                    {lesson.content?.reading?.text || lesson.description}
                                </p>
                                <div className="flex justify-center gap-6">
                                    <button
                                        onClick={() => handlePlayAudio(lesson.content?.reading?.text || lesson.title)}
                                        disabled={isPlaying}
                                        className="btn-primary py-6 px-12 text-2xl flex items-center gap-4 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all border-4 border-white/20"
                                    >
                                        {isPlaying ? (
                                            <div className="animate-pulse flex items-center gap-2">
                                                <Sparkles className="w-6 h-6 animate-spin" /> AI Speaking...
                                            </div>
                                        ) : (
                                            <><Sparkles className="w-8 h-8 text-yellow-300" /> Play AI Voice Lesson</>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Vocabulary Grid */}
                            {lesson.vocabulary?.length > 0 && (
                                <div className="mt-16 pt-16 border-t-4 border-forest-50">
                                    <h3 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
                                        <Sparkles className="text-yellow-500" /> New Words You'll Learn:
                                    </h3>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {lesson.vocabulary.map((voc, idx) => (
                                            <motion.div
                                                key={idx}
                                                whileHover={{ y: -5 }}
                                                className="bg-forest-50 p-6 rounded-[2rem] border-2 border-forest-100 flex flex-col items-center text-center group"
                                            >
                                                <div className="text-5xl mb-4 font-tamil text-forest-700 bg-white w-24 h-24 flex items-center justify-center rounded-3xl shadow-sm group-hover:scale-110 transition-transform">
                                                    {voc.word}
                                                </div>
                                                <p className="text-2xl font-bold text-gray-800 mb-1">{voc.translation}</p>
                                                <p className="text-gray-500 italic mb-4">Pronunciation: {voc.pronunciation || voc.word}</p>
                                                <button
                                                    onClick={() => handlePlayAudio(voc.word)}
                                                    className="w-full bg-white text-forest-600 py-3 rounded-2xl font-bold hover:bg-forest-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Mic className="w-5 h-5" /> Say It!
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'writing' && lesson.content?.writing?.[0] && (
                        <div className="text-center p-8">
                            <h2 className="text-3xl font-bold mb-6 text-forest-800">Practice Writing</h2>
                            <p className="text-xl text-gray-600 mb-8">Trace the letter with your finger or mouse</p>
                            <div className="bg-white rounded-3xl p-12 mb-8 border-4 border-dashed border-forest-200 relative overflow-hidden group">
                                <div className="text-[12rem] text-gray-100 font-tamil select-none group-hover:text-gray-200 transition-colors">
                                    {writingChar}
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/handwriting', { state: { character: writingChar } })}
                                className="btn-primary py-4 px-12 text-xl"
                            >
                                Start Dynamic Practice ✍️
                            </button>
                        </div>
                    )}

                    {activeTab === 'speaking' && lesson.content?.speaking?.[0] && (
                        <div className="text-center p-8">
                            <h2 className="text-2xl font-bold mb-4">Speaking Practice</h2>
                            <div className="text-7xl mb-6 text-forest-500">🎤</div>
                            <p className="text-3xl mb-10 text-gray-800 font-bold">
                                {lesson.content.speaking[0].phrase}
                            </p>
                            <button
                                onClick={handleStartRecording}
                                disabled={isRecording}
                                className="btn-primary py-6 px-16 text-2xl rounded-full"
                            >
                                {isRecording ? '⏺️ Analyzing...' : 'Start Voice Review'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'listening' && lesson.content?.listening?.[0] && (
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-6 text-forest-800">Listening Exercise</h2>
                            <div className="space-y-4">
                                <div className="bg-blue-50/50 p-10 rounded-[3rem] border-2 border-blue-100">
                                    <p className="text-2xl font-bold mb-6 text-gray-800">
                                        {lesson.content.listening[0].question}
                                    </p>
                                    <button
                                        onClick={() => handlePlayAudio(lesson.content.listening[0].options[lesson.content.listening[0].correctAnswer])}
                                        disabled={isPlaying}
                                        className="btn-primary mb-10 py-4 px-10 text-xl"
                                    >
                                        🔊 {isPlaying ? 'Playing...' : 'Play Mystery Sound'}
                                    </button>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {lesson.content.listening[0].options.map((option, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    if (idx === lesson.content.listening[0].correctAnswer) alert('Excellent! Correct! 🎉');
                                                    else alert('Not this one, try again! 🍀');
                                                }}
                                                className="glass py-6 text-4xl hover:bg-forest-100 transition-all rounded-3xl border-2 border-forest-50"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}



                    {/* Final Action Button */}
                    <div className="p-8 border-t-4 border-forest-50 bg-forest-50/20 text-center">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleStartQuiz}
                            className="btn-primary py-6 px-16 text-2xl rounded-[2rem] shadow-xl flex items-center gap-4 mx-auto"
                        >
                            <Award className="w-8 h-8" />
                            Take Final Quiz to Complete Lesson!
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonDetail;
