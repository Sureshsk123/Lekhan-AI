import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, XCircle, Sparkles, Volume2, Trash2, Zap, Search, ShieldCheck, Cpu, Clock, MousePointer2, Info } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TopBar from '../components/TopBar';

const HandwritingTutor = () => {
    const navigate = useNavigate();
    const { language: urlLanguage } = useParams();
    const { API_URL, user, token } = useAuth();
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [language, setLanguage] = useState(urlLanguage || user?.enrolledLanguages?.[0] || 'tamil');
    const fileInputRef = useRef(null);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setResult(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('image', selectedImage);
        formData.append('language', language);

        try {
            const response = await axios.post(`${API_URL}/ocr/handwriting`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setResult(response.data);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error processing image. The AI engine might be busy.');
        } finally {
            setLoading(false);
        }
    };

    const handleSpeak = (text) => {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        const localeMap = { tamil: 'ta-IN', hindi: 'hi-IN', telugu: 'te-IN', kannada: 'kn-IN', malayalam: 'ml-IN', english: 'en-US' };
        utterance.lang = localeMap[language] || 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const discardImage = () => {
        setPreview(null);
        setSelectedImage(null);
        setResult(null);
    };

    return (
        <div className="min-h-screen pt-28 pb-12 px-6 bg-[#F0F2F5]">
            <TopBar />
            <div className="max-w-7xl mx-auto">
                {/* Dashboard Header */}
                <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="flex items-center gap-6">
                        <div className="bg-indigo-600 p-4 rounded-[1.5rem] shadow-xl shadow-indigo-100">
                            <Search className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-gray-800 tracking-tight">AI Neural Scanner</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Target Language:</span>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="bg-white/80 border border-gray-100 text-[10px] font-black text-indigo-600 rounded-full px-4 py-1.5 outline-none cursor-pointer hover:border-indigo-200 transition-colors uppercase tracking-widest"
                                >
                                    {user?.enrolledLanguages?.map(lang => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={discardImage}
                            className="px-8 py-4 rounded-2xl bg-white text-gray-600 font-bold border-2 border-gray-100 hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                            <Trash2 className="w-5 h-5" />
                            Reset
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleUpload}
                            disabled={loading || !selectedImage}
                            className={`px-10 py-4 rounded-2xl font-black text-white shadow-xl flex items-center gap-3 transition-all ${loading || !selectedImage ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                                }`}
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles className="w-5 h-5" />}
                            Initialize Neural Scan
                        </motion.button>
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Left Panel: Scanning View */}
                    <div className="lg:col-span-8 space-y-8">
                        <motion.div
                            className="bg-white rounded-[3rem] p-6 min-h-[500px] flex items-center justify-center relative overflow-hidden border border-gray-100 shadow-2xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <AnimatePresence mode="wait">
                                {!preview ? (
                                    <motion.div
                                        key="upload"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="text-center p-12"
                                    >
                                        <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8 text-indigo-500 relative">
                                            <Upload className="w-12 h-12" />
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="absolute inset-0 bg-indigo-200 rounded-full"
                                            />
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-800 mb-2">Awaiting Input...</h3>
                                        <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium">Capture your handwriting and let our AI decompose it into digital intelligence.</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="hidden"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-indigo-600 text-white py-5 px-12 rounded-[2rem] text-xl font-black shadow-2xl shadow-indigo-100 hover:scale-105 transition-transform"
                                        >
                                            Upload Neural Sample
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="preview"
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="w-full h-full flex flex-col gap-6"
                                    >
                                        <div className="grid md:grid-cols-2 gap-6 flex-1">
                                            {/* Original View */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-indigo-500 rounded-full" /> Optical Source Sensor
                                                </label>
                                                <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-gray-50 group">
                                                    <img src={preview} className="w-full h-full object-contain" />
                                                    <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Search className="w-8 h-8 text-white" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* AI Filtered View */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" /> Neural Path Analytics
                                                </label>
                                                <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-900 border-4 border-slate-800 shadow-2xl flex items-center justify-center">
                                                    <div className="absolute inset-0 z-0">
                                                        <img src={preview} className="w-full h-full object-contain filter invert sepia saturate-200 hue-rotate-180 brightness-150 contrast-150 opacity-40 blur-[1px]" />
                                                    </div>

                                                    {loading && (
                                                        <motion.div
                                                            className="absolute left-0 right-0 h-1.5 bg-indigo-500/80 shadow-[0_0_20px_rgba(79,70,229,1)] z-30"
                                                            animate={{ top: ['0%', '100%', '0%'] }}
                                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                        />
                                                    )}

                                                    <div className="relative z-10 text-center flex flex-col items-center gap-4">
                                                        {loading ? (
                                                            <div className="bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-700">
                                                                <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em]">Decomposing Strokes...</span>
                                                            </div>
                                                        ) : result ? (
                                                            <div className="bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-emerald-500/50">
                                                                <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">Scan Sync Complete</span>
                                                            </div>
                                                        ) : (
                                                            <div className="bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-slate-700">
                                                                <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Ready for Analysis</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* Right Panel: AI Intelligence Report */}
                    <div className="lg:col-span-4 h-full">
                        <motion.div
                            className="bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-full border border-gray-100"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="p-8 bg-indigo-600 text-white relative h-40 flex items-center overflow-hidden">
                                <div className="relative z-10">
                                    <h2 className="text-3xl font-black tracking-tight mb-1">Intelligence Report</h2>
                                    <p className="text-sm font-medium opacity-80">Neural OCR Core v2.4 (Gemini-Advanced)</p>
                                </div>
                                <ShieldCheck className="absolute -bottom-6 -right-6 w-40 h-40 opacity-10 rotate-12" />
                            </div>

                            <div className="flex-1 p-8 space-y-10 overflow-y-auto no-scrollbar">
                                {!result ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-30 grayscale blur-[1px]">
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                            <Cpu className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Neural Core Idle</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Captured Result */}
                                        <section>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Primary Detection</span>
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${result.confidence > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                                                    }`}>
                                                    {Math.round(result.confidence)}% Confidence
                                                </span>
                                            </div>
                                            <div className="bg-gray-50 rounded-[2rem] p-8 border-2 border-dashed border-gray-100 relative group">
                                                <div className="text-6xl font-black text-center text-gray-800 font-tamil mb-4">
                                                    {result.detectedText}
                                                </div>
                                                <button
                                                    onClick={() => handleSpeak(result.detectedText)}
                                                    className="absolute bottom-4 right-4 p-3 bg-white shadow-lg rounded-full text-indigo-600 hover:scale-110 transition-transform"
                                                >
                                                    <Volume2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </section>

                                        {/* AI Metrics */}
                                        <section className="bg-indigo-50 rounded-[2.5rem] p-6 space-y-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Cpu className="w-4 h-4 text-indigo-600" />
                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Engine Metadata</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <MetricMini label="Engine" value={result.performanceMetrics?.engineUsed || 'Gemini 1.5'} />
                                                <MetricMini label="Latency" value={`${result.performanceMetrics?.timeTaken || '0.8'}s`} />
                                            </div>
                                        </section>

                                        {/* Correction Intelligence */}
                                        <section className="space-y-4">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Grammar & Script Corrections</span>
                                            <div className="space-y-4">
                                                {result.corrections?.length > 0 ? result.corrections.map((c, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className={`p-5 rounded-[2rem] border-2 flex flex-col gap-2 ${c.isCorrect ? 'bg-emerald-50 border-emerald-100' : 'bg-orange-50 border-orange-100'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-black text-gray-800 text-lg font-tamil">{c.original}</span>
                                                                {!c.isCorrect && (
                                                                    <>
                                                                        <span className="text-gray-400">→</span>
                                                                        <span className="font-black text-indigo-600 text-lg font-tamil">{c.corrected}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                            {c.isCorrect ? <CheckCircle className="w-5 h-5 text-emerald-500" /> : <Info className="w-5 h-5 text-orange-400" />}
                                                        </div>
                                                        <p className="text-[10px] font-bold text-gray-500 italic opacity-80 leading-relaxed">
                                                            "{c.message || 'Perfectly written character.'}"
                                                        </p>
                                                    </motion.div>
                                                )) : (
                                                    <div className="text-center py-6 bg-gray-50 rounded-3xl border border-gray-100 italic text-gray-400 text-sm">
                                                        No anomalies detected in your sample.
                                                    </div>
                                                )}
                                            </div>
                                        </section>

                                        <button
                                            onClick={() => navigate('/dashboard')}
                                            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 mt-4"
                                        >
                                            Analysis Finalized <ArrowRight className="w-6 h-6" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetricMini = ({ label, value }) => (
    <div className="bg-white/60 p-3 rounded-2xl flex flex-col">
        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</span>
        <span className="text-xs font-black text-indigo-600 truncate">{value}</span>
    </div>
);

const ArrowRight = ({ className }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
);

export default HandwritingTutor;
