import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';

const QuizEngine = () => {
    const { lessonId } = useParams();
    const navigate = useNavigate();
    const { token, addXP } = useAuth();

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [quizComplete, setQuizComplete] = useState(false);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await axios.post(`http://localhost:5001/api/quiz/generate/${lessonId}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setQuestions(res.data.questions);
                }
            } catch (err) {
                console.error('Quiz generation failed:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [lessonId, token]);

    const handleAnswer = (answer) => {
        if (showFeedback) return;

        const currentQ = questions[currentIndex];
        let correct = false;

        if (currentQ.type === 'mcq') {
            correct = answer === currentQ.correctAnswer;
            setSelectedOption(answer);
        } else if (currentQ.type === 'fill_blank') {
            correct = answer.toLowerCase().trim() === currentQ.correctAnswer.toLowerCase().trim();
        }

        setIsCorrect(correct);
        if (correct) setScore(s => s + 1);
        setShowFeedback(true);

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setShowFeedback(false);
                setSelectedOption(null);
                setInputValue('');
            } else {
                finishQuiz();
            }
        }, 1500);
    };

    const finishQuiz = async () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const accuracy = Math.round((score / questions.length) * 100);

        try {
            const res = await axios.post('http://localhost:5001/api/quiz/submit', {
                lessonId,
                score,
                totalQuestions: questions.length,
                timeSpent,
                accuracy
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setQuizComplete(true);
                // The results page will handle further navigation
                navigate('/quiz-results', {
                    state: {
                        attempt: res.data.attempt,
                        xpEarned: res.data.xpEarned,
                        diamondBonus: res.data.diamondBonus,
                        newStats: res.data.newStats
                    }
                });
            }
        } catch (err) {
            console.error('Quiz submission failed:', err);
            navigate('/dashboard');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full" />
        </div>
    );

    if (!questions.length) return (
        <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No questions available for this quiz.</h2>
            <button onClick={() => navigate(-1)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl">Go Back</button>
        </div>
    );

    const currentQ = questions[currentIndex];
    const progress = ((currentIndex) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-[#F0F2F5]">
            <TopBar />
            <div className="max-w-2xl mx-auto pt-24 px-6">
                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-indigo-600"
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100"
                    >
                        <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">Question {currentIndex + 1} of {questions.length}</span>
                        <h2 className="text-2xl font-bold text-gray-800 mt-2 mb-8 leading-relaxed">
                            {currentQ.question}
                        </h2>

                        {currentQ.type === 'mcq' ? (
                            <div className="grid grid-cols-1 gap-4">
                                {currentQ.options.map((option, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(idx)}
                                        disabled={showFeedback}
                                        className={`w-full p-5 rounded-2xl text-left font-medium transition-all border-2 ${showFeedback
                                                ? idx === currentQ.correctAnswer
                                                    ? 'bg-green-50 border-green-500 text-green-700'
                                                    : idx === selectedOption
                                                        ? 'bg-red-50 border-red-500 text-red-700'
                                                        : 'bg-gray-50 border-gray-100 text-gray-400'
                                                : 'bg-white border-gray-100 hover:border-indigo-600 text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{option}</span>
                                            {showFeedback && idx === currentQ.correctAnswer && <span className="text-xl">✅</span>}
                                            {showFeedback && idx === selectedOption && idx !== currentQ.correctAnswer && <span className="text-xl">❌</span>}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type your answer here..."
                                    className={`w-full p-5 rounded-2xl border-2 outline-none transition-all text-xl text-center ${showFeedback
                                            ? isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                                            : 'border-gray-100 focus:border-indigo-600'
                                        }`}
                                    disabled={showFeedback}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAnswer(inputValue)}
                                />
                                {!showFeedback && (
                                    <button
                                        onClick={() => handleAnswer(inputValue)}
                                        className="bg-indigo-600 text-white p-5 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100"
                                    >
                                        Submit Answer
                                    </button>
                                )}
                                {showFeedback && !isCorrect && (
                                    <div className="text-center text-red-600 font-bold">
                                        Correct answer: {currentQ.correctAnswer}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Feedback Toast */}
                <AnimatePresence>
                    {showFeedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-12 py-6 rounded-3xl shadow-2xl flex items-center gap-4 border-2 ${isCorrect
                                    ? 'bg-green-500 border-green-400 text-white'
                                    : 'bg-red-500 border-red-400 text-white'
                                }`}
                        >
                            <span className="text-3xl">{isCorrect ? '🎉' : '💡'}</span>
                            <div className="flex flex-col">
                                <span className="text-xl font-black">{isCorrect ? 'AMAZING!' : 'NOT QUITE'}</span>
                                <span className="text-sm font-medium opacity-90">{isCorrect ? '+10 XP Earned' : 'Keep going, you got this!'}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default QuizEngine;
