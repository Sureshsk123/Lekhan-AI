import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Volume2, CheckCircle } from 'lucide-react';

const StoryDetail = () => {
    const { id } = useParams();
    const [showQuiz, setShowQuiz] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const story = {
        title: 'The Clever Crow',
        content: `Once upon a time, there was a clever crow who was very thirsty. He found a pot with a little water at the bottom, but his beak couldn't reach it. 

The crow thought of a brilliant idea! He picked up small stones and dropped them into the pot one by one. As the stones filled the pot, the water level rose higher and higher.

Finally, the water reached the top, and the crow could drink it! The crow's cleverness saved him from thirst.`,
        newWords: [
            { word: 'காகம்', meaning: 'Crow', pronunciation: 'Kaagam' },
            { word: 'புத்திசாலி', meaning: 'Clever', pronunciation: 'Puththisaali' },
            { word: 'தாகம்', meaning: 'Thirst', pronunciation: 'Thaagam' }
        ],
        questions: [
            {
                question: 'What was the crow\'s problem?',
                options: ['He was hungry', 'He was thirsty', 'He was tired', 'He was lost'],
                correct: 1
            },
            {
                question: 'How did the crow solve the problem?',
                options: ['He flew away', 'He broke the pot', 'He dropped stones', 'He called friends'],
                correct: 2
            }
        ]
    };

    const handleAudioPlay = () => {
        setIsPlaying(true);
        const utterance = new SpeechSynthesisUtterance(story.content);
        utterance.onend = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
    };

    const handleOptionSelect = (qIndex, optIndex) => {
        setSelectedAnswers({ ...selectedAnswers, [qIndex]: optIndex });
    };

    const handleSubmitQuiz = () => {
        let correctCount = 0;
        story.questions.forEach((q, i) => {
            if (selectedAnswers[i] === q.correct) correctCount++;
        });
        setScore(correctCount);
        alert(`You scored ${correctCount} out of ${story.questions.length}!`);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                >
                    <div className="text-center mb-8">
                        <div className="text-7xl mb-4">🐦</div>
                        <h1 className="text-4xl font-bold text-gradient child-font mb-4">
                            {story.title}
                        </h1>
                        <button
                            onClick={handleAudioPlay}
                            disabled={isPlaying}
                            className="btn-primary flex items-center gap-2 mx-auto disabled:opacity-50"
                        >
                            <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
                            {isPlaying ? 'Playing Narration...' : 'Play Audio Narration'}
                        </button>
                    </div>

                    {!showQuiz ? (
                        <>
                            <div className="prose prose-lg max-w-none mb-8">
                                {story.content.split('\n\n').map((para, i) => (
                                    <p key={i} className="text-gray-700 mb-4 text-lg leading-relaxed">
                                        {para}
                                    </p>
                                ))}
                            </div>

                            {/* New Words */}
                            <div className="bg-yellow-50 rounded-xl p-6 mb-8">
                                <h3 className="text-xl font-bold text-yellow-800 mb-4">📝 New Words:</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {story.newWords.map((word, i) => (
                                        <div key={i} className="bg-white rounded-lg p-4">
                                            <p className="text-2xl font-bold text-gray-800">{word.word}</p>
                                            <p className="text-gray-600">{word.meaning}</p>
                                            <p className="text-sm text-gray-500 italic">{word.pronunciation}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setShowQuiz(true)}
                                className="btn-primary w-full py-4 text-lg"
                            >
                                Take Comprehension Quiz 🎯
                            </button>
                        </>
                    ) : (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Comprehension Quiz</h2>
                            <div className="space-y-6">
                                {story.questions.map((q, i) => (
                                    <div key={i} className="bg-blue-50 rounded-xl p-6">
                                        <p className="font-semibold mb-4">{i + 1}. {q.question}</p>
                                        <div className="space-y-2">
                                            {q.options.map((opt, j) => (
                                                <button
                                                    key={j}
                                                    onClick={() => handleOptionSelect(i, j)}
                                                    className={`w-full glass p-3 text-left transition-all ${selectedAnswers[i] === j
                                                            ? 'bg-blue-200 border-blue-400'
                                                            : 'hover:bg-blue-100'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={handleSubmitQuiz}
                                    className="btn-primary w-full py-4"
                                >
                                    Submit Quiz
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default StoryDetail;
