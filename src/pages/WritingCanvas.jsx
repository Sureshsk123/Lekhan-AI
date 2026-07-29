import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eraser, RotateCcw, Play, ArrowRight, CheckCircle, Brain, Sparkles, Send } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';

const WritingCanvas = () => {
    const { language: urlLanguage } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [letters, setLetters] = useState([]);
    const [strokes, setStrokes] = useState([]); // User's drawn strokes
    const [currentStroke, setCurrentStroke] = useState([]);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        const lang = urlLanguage || user?.enrolledLanguages?.[0] || 'tamil';
        const canvasData = {
            tamil: [
                { char: 'அ', name: 'Ah', strokes: [[150, 150], [250, 150], [250, 250], [150, 250], [150, 200], [300, 200]] },
                { char: 'ஆ', name: 'Aah', strokes: [[150, 150], [250, 150], [250, 250], [150, 250], [150, 200], [350, 200], [350, 300]] }
            ],
            hindi: [
                { char: 'अ', name: 'Ah', strokes: [[100, 100], [200, 100], [200, 200], [100, 200], [100, 300], [200, 300]] },
                { char: 'आ', name: 'Aah', strokes: [[100, 100], [200, 100], [200, 300], [300, 100], [300, 300]] }
            ]
        };
        setLetters(canvasData[lang] || canvasData.tamil);
        setCurrentLetterIndex(0);
    }, [urlLanguage, user]);

    const currentLetter = letters[currentLetterIndex] || {};

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.lineWidth = 10;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = '#4f46e5'; // Indigo primary
        }
    }, [letters]);

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        if (isAnimating || isEvaluating) return;
        setIsDrawing(true);
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
        setCurrentStroke([{ x, y, t: Date.now() }]);
        setEvaluationResult(null);
    };

    const draw = (e) => {
        if (!isDrawing || isAnimating || isEvaluating) return;
        const { x, y } = getCoordinates(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(x, y);
        ctx.stroke();
        setCurrentStroke(prev => [...prev, { x, y, t: Date.now() }]);
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        setStrokes(prev => [...prev, currentStroke]);
        setCurrentStroke([]);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setStrokes([]);
        setEvaluationResult(null);
        setFeedback('');
    };

    const handleEvaluate = async () => {
        if (strokes.length === 0) return;
        setIsEvaluating(true);
        setFeedback('AI is checking your strokes...');

        try {
            const canvas = canvasRef.current;
            const imageData = canvas.toDataURL('image/png');

            const res = await axios.post('http://localhost:5001/api/handwriting-eval/evaluate', {
                image: imageData,
                expectedChar: currentLetter.char,
                strokes: strokes // Stroke data for dynamic evaluation
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                setEvaluationResult(res.data.evaluation);
                setFeedback(res.data.evaluation.feedback);
            }
        } catch (err) {
            console.error('Evaluation failed:', err);
            setFeedback('Oops! AI couldn\'t evaluate. Try again.');
        } finally {
            setIsEvaluating(false);
        }
    };

    const handleShowAnimation = async () => {
        if (isAnimating) return;
        setIsAnimating(true);
        clearCanvas();
        const ctx = canvasRef.current.getContext('2d');
        const targetStrokes = currentLetter.strokes;
        setFeedback('Watch carefully... 📽️');

        ctx.strokeStyle = '#a855f7'; // Purple for demo
        for (let i = 0; i < targetStrokes.length; i++) {
            const [x, y] = targetStrokes[i];
            if (i === 0) ctx.moveTo(x, y);
            else {
                const [prevX, prevY] = targetStrokes[i - 1];
                for (let t = 0; t <= 1; t += 0.1) {
                    ctx.lineTo(prevX + (x - prevX) * t, prevY + (y - prevY) * t);
                    ctx.stroke();
                    await new Promise(r => setTimeout(r, 30));
                }
            }
        }
        setIsAnimating(false);
        setFeedback('Now your turn! ✍️');
        ctx.strokeStyle = '#4f46e5';
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5]">
            <TopBar />
            <div className="max-w-7xl mx-auto pt-28 px-6 pb-20">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Instructions & Reference */}
                    <div className="lg:w-1/3 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-100 text-center"
                        >
                            <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-4 block">Practice Target</span>
                            <div className="text-[10rem] font-black text-gray-800 leading-none mb-6 font-tamil">
                                {currentLetter.char}
                            </div>
                            <h2 className="text-2xl font-black text-gray-700 mb-8">{currentLetter.name}</h2>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={handleShowAnimation}
                                    className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl font-bold flex flex-col items-center gap-2 hover:bg-indigo-100 transition-all"
                                >
                                    <Play className="w-6 h-6" />
                                    <span>Watch</span>
                                </button>
                                <button
                                    onClick={() => setCurrentLetterIndex(prev => (prev + 1) % letters.length)}
                                    className="bg-gray-50 text-gray-600 p-4 rounded-2xl font-bold flex flex-col items-center gap-2 hover:bg-gray-100 transition-all"
                                >
                                    <ArrowRight className="w-6 h-6" />
                                    <span>Next</span>
                                </button>
                            </div>
                        </motion.div>

                        {evaluationResult && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
                            >
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-black">AI Assessment</h3>
                                        <div className="bg-white/20 px-4 py-1 rounded-full text-sm font-black uppercase">
                                            Score: {evaluationResult.totalScore}%
                                        </div>
                                    </div>
                                    <p className="text-lg font-medium opacity-90 mb-6 leading-relaxed italic">
                                        "{evaluationResult.feedback}"
                                    </p>
                                    <div className="space-y-4">
                                        <Metric label="Form Accuracy" value={evaluationResult.metrics.shapeAccuracy} />
                                        <Metric label="Stroke Order" value={evaluationResult.metrics.strokeOrder} />
                                    </div>
                                </div>
                                <Brain className="absolute -bottom-8 -right-8 w-40 h-40 opacity-10 rotate-12" />
                            </motion.div>
                        )}
                    </div>

                    {/* Canvas Area */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                                    <Sparkles className="text-indigo-600" /> Interactive Canvas
                                </h2>
                                <div className="flex gap-3">
                                    <button
                                        onClick={clearCanvas}
                                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        title="Clear All"
                                    >
                                        <Eraser className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={handleEvaluate}
                                        disabled={strokes.length === 0 || isEvaluating}
                                        className={`px-8 py-3 rounded-xl font-black flex items-center gap-2 transition-all ${strokes.length > 0 && !isEvaluating
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {isEvaluating ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                        Check Handwriting
                                    </button>
                                </div>
                            </div>

                            <div className="relative aspect-[4/3] bg-gray-50 rounded-[2rem] border-4 border-dashed border-gray-200 overflow-hidden">
                                <canvas
                                    ref={canvasRef}
                                    width={800}
                                    height={600}
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                    onTouchStart={startDrawing}
                                    onTouchMove={draw}
                                    onTouchEnd={stopDrawing}
                                    className="w-full h-full cursor-crosshair touch-none"
                                />
                                {strokes.length === 0 && !isAnimating && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                        <div className="text-7xl font-tamil text-gray-400 select-none">
                                            {currentLetter.char}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex items-center justify-between text-gray-400 font-bold uppercase text-xs tracking-widest px-4">
                                <span>Capture Density: {strokes.reduce((acc, s) => acc + s.length, 0)} pts</span>
                                <span className={feedback.includes('AI') ? 'text-indigo-600 italic' : ''}>{feedback || 'Start drawing to see feedback'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Metric = ({ label, value }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-black uppercase tracking-widest">
            <span>{label}</span>
            <span>{value}%</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
            />
        </div>
    </div>
);

export default WritingCanvas;
