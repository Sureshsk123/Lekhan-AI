import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Send, Volume2, Sparkles, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const VoiceTutor = () => {
    const { language: urlLanguage } = useParams();
    const { API_URL, user } = useAuth();
    const lang = urlLanguage || user?.enrolledLanguages?.[0] || 'tamil';

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const greetings = {
            tamil: 'வணக்கம்! Hello! I am your Tamil AI tutor. How can I help you today?',
            hindi: 'नमस्ते! Hello! I am your Hindi AI tutor. How can I help you today?',
            telugu: 'నమస్కారం! Hello! I am your Telugu AI tutor. How can I help you today?',
            kannada: 'ನಮಸ್ಕಾರ! Hello! I am your Kannada AI tutor. How can I help you today?',
            malayalam: 'നമസ്കാരം! Hello! I am your Malayalam AI tutor. How can I help you today?',
            english: "Hello! I am your English AI tutor. I can help you with grammar, vocabulary, and pronunciation. How can I help you today?"
        };
        setMessages([{ role: 'assistant', content: greetings[lang] || greetings.english }]);
    }, [lang]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    React.useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'ta-IN';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsRecording(false);
                setTimeout(() => handleSend(transcript), 500);
            };

            recognitionRef.current.onerror = () => setIsRecording(false);
            recognitionRef.current.onend = () => setIsRecording(false);
        }
    }, []);

    const handleSend = async (overrideInput) => {
        const textToSend = overrideInput || input;
        if (!textToSend.trim() || loading) return;

        // 1. Add user message locally
        const userMsg = { role: 'user', content: textToSend };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // --- FAST PATH: Smart Intent Matching ---
        const lowerText = textToSend.toLowerCase().trim();
        const commonGreetings = ['hi', 'hello', 'hey', 'vanakkam', 'வணக்கம்', 'namaste'];

        // Only trigger instant greeting if it's a dedicated greeting word
        const isGreeting = commonGreetings.includes(lowerText) ||
            (lowerText.length <= 4 && commonGreetings.some(g => lowerText.startsWith(g)));

        // Ensure "history" or "how" doesn't trigger a generic greeting
        const isComplex = lowerText.includes('history') || lowerText.includes('roadmap') || lowerText.includes('step') || lowerText.includes('tip');

        if (isGreeting && !isComplex) {
            const greetingsLocal = {
                tamil: 'வணக்கம்! (Hello!) I am your AI tutor. I am so happy to see you today! How can I help you learn?',
                hindi: 'नमस्ते! (Hello!) I am your AI tutor. I am so happy to see you today! How can I help you learn?',
                telugu: 'నమస్కారం! (Hello!) I am your AI tutor. I am so happy to see you today! How can I help you learn?',
                kannada: 'ನಮಸ್ಕಾರ! (Hello!) I am your AI tutor. I am so happy to see you today! How can I help you learn?',
                malayalam: 'നമസ്കാരം! (Hello!) I am your AI tutor. I am so happy to see you today! How can I help you learn?'
            };
            const instantReply = {
                role: 'assistant',
                content: greetingsLocal[lang] || greetingsLocal.tamil
            };
            setMessages(prev => [...prev, instantReply]);
            playResponse(instantReply.content);
            return;
        }

        setLoading(true);

        try {
            // 2. Call our Real AI Chat Endpoint for complex queries
            const response = await axios.post(`${API_URL}/lessons/chat`, {
                message: textToSend,
                language: lang,
                history: messages // Pass the conversation history!
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data.success) {
                const aiMsg = { role: 'assistant', content: response.data.reply };
                setMessages(prev => [...prev, aiMsg]);

                // 3. Auto-play the AI response (Neural TTS fallback)
                playResponse(response.data.reply);
            }
        } catch (error) {
            console.error('Tutor Error:', error);
            const waitLocal = {
                tamil: 'சற்று பொறுங்கள்! (Wait a moment!) I am processing.',
                hindi: 'कृपया प्रतीक्षा करें! (Wait a moment!) I am processing.',
                telugu: 'వేచి ఉండండి! (Wait a moment!) I am processing.',
                kannada: 'ಸ್ವಲ್ಪ ಕಾಯಿರಿ! (Wait a moment!) I am processing.',
                malayalam: 'ദയവായി കാത്തിരിക്കുക! (Wait a moment!) I am processing.'
            };
            setMessages(prev => [...prev, { role: 'assistant', content: waitLocal[lang] || waitLocal.tamil }]);
        } finally {
            setLoading(false);
        }
    };

    const playResponse = (text) => {
        if (!text) return;

        // Use the Backend TTS Bridge
        const ttsLangMap = { tamil: 'ta', hindi: 'hi', telugu: 'te', kannada: 'kn', malayalam: 'ml' };
        const ttsCode = ttsLangMap[lang] || 'ta';
        const audioUrl = `${API_URL}/lessons/tts?text=${encodeURIComponent(text)}&lang=${ttsCode}`;
        const audio = new Audio(audioUrl);

        audio.play().catch(e => {
            // Native fallback
            const utterance = new SpeechSynthesisUtterance(text);
            const localeMap = { tamil: 'ta-IN', hindi: 'hi-IN', telugu: 'te-IN', kannada: 'kn-IN', malayalam: 'ml-IN' };
            utterance.lang = localeMap[lang] || 'ta-IN';
            window.speechSynthesis.speak(utterance);
        });
    };

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in this browser. Please try Chrome.');
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setIsRecording(true);
            recognitionRef.current.start();
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold text-gradient child-font text-center mb-8"
                >
                    🎤 Voice & Chat Tutor
                </motion.h1>

                <div className="card h-[700px] flex flex-col p-0 overflow-hidden shadow-2xl border-0 bg-white/90 backdrop-blur-md">
                    {/* Tutor Profile Header */}
                    <div className="bg-gradient-to-r from-forest-500 to-forest-700 p-6 flex items-center gap-4 text-white shadow-lg relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                            <Sparkles className="w-10 h-10 text-yellow-300" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black child-font leading-tight">Muthu Master</h2>
                            <div className="flex items-center gap-2 text-forest-50/80">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-sm font-medium">Online & Ready to Teach!</span>
                            </div>
                        </div>
                        <div className="ml-auto opacity-20 transform scale-150 rotate-12">
                            <MessageCircle className="w-24 h-24" />
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-forest-50/20">
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[85%] p-5 rounded-[2rem] shadow-sm relative ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-forest-500 to-forest-700 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 rounded-tl-none border-2 border-forest-50'
                                    }`}>
                                    <p className="text-xl leading-relaxed">{msg.content}</p>
                                    <div className={`text-[10px] mt-2 opacity-50 uppercase font-bold tracking-widest ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                        {msg.role === 'user' ? 'Student' : 'Master'}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start"
                            >
                                <div className="bg-white p-5 rounded-[2rem] rounded-tl-none border-2 border-forest-50 flex gap-2 items-center shadow-md">
                                    <div className="w-2 h-2 bg-forest-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-forest-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                    <div className="w-2 h-2 bg-forest-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    <span className="text-forest-600 font-bold ml-2 text-xs uppercase tracking-widest">Master is speaking...</span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions Chips */}
                    <div className="px-6 py-4 bg-white border-t border-forest-50 flex gap-2 overflow-x-auto no-scrollbar">
                        {[
                            { label: "📍 Roadmap", query: "give me a roadmap to learn tamil" },
                            { label: "🗣️ Practice", query: "I want to practice speaking" },
                            { label: "📚 History", query: "tell me about tamil history" },
                            { label: "💡 Tips", query: "give me some learning tips" }
                        ].map((chip, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSend(chip.query)}
                                className="whitespace-nowrap px-5 py-2 rounded-xl bg-forest-50 text-forest-700 font-bold text-sm border-2 border-forest-100 hover:bg-forest-500 hover:text-white hover:border-forest-500 transition-all active:scale-95"
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-white border-t border-forest-50 flex gap-3 items-center">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleRecording}
                            className={`w-16 h-16 flex items-center justify-center rounded-2xl shadow-xl transition-all ${isRecording
                                ? 'bg-red-500 animate-pulse ring-4 ring-red-100'
                                : 'bg-gradient-to-br from-orange-400 to-red-500'
                                } text-white`}
                        >
                            <Mic className="w-8 h-8" />
                        </motion.button>

                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Type your message to Master..."
                                className="w-full px-8 py-5 rounded-3xl bg-gray-50 border-2 border-forest-50 focus:border-forest-500 focus:bg-white focus:outline-none text-lg transition-all"
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleSend()}
                            className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-forest-500 to-forest-700 text-white shadow-xl hover:shadow-2xl transition-all"
                        >
                            <Send className="w-7 h-7" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoiceTutor;
