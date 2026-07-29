import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid3x3, Search, Type, Trophy, Lightbulb, ChevronRight, ChevronLeft, Sparkles, Target } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Word Library with Clear Meanings for All Languages
const WORD_LIBRARY = {
    tamil: [
        { word: 'அம்மா', hint: 'Mother' }, { word: 'அப்பா', hint: 'Father' }, { word: 'படம்', hint: 'Picture' },
        { word: 'மரம்', hint: 'Tree' }, { word: 'கால்', hint: 'Leg' }, { word: 'தலை', hint: 'Head' },
        { word: 'தமிழ்', hint: 'Tamil' }, { word: 'வளரும்', hint: 'Growing' }, { word: 'கற்க', hint: 'Learn' },
        { word: 'இனிமை', hint: 'Sweetness' }, { word: 'பூமி', hint: 'Earth' }, { word: 'ஆறு', hint: 'River' },
        { word: 'புத்தகம்', hint: 'Book' }, { word: 'பள்ளி', hint: 'School' }, { word: 'வானம்', hint: 'Sky' },
        { word: 'நிலவு', hint: 'Moon' }, { word: 'கடல்', hint: 'Ocean' }, { word: 'மலை', hint: 'Mountain' }
    ],
    hindi: [
        { word: 'नमस्ते', hint: 'Hello' }, { word: 'भारत', hint: 'India' }, { word: 'कमल', hint: 'Lotus' },
        { word: 'आम', hint: 'Mango' }, { word: 'किताब', hint: 'Book' }, { word: 'पानी', hint: 'Water' },
        { word: 'लड़का', hint: 'Boy' }, { word: 'लड़की', hint: 'Girl' }, { word: 'पहाड़', hint: 'Mountain' },
        { word: 'नदी', hint: 'River' }, { word: 'फूल', hint: 'Flower' }, { word: 'सड़क', hint: 'Road' },
        { word: 'सूरज', hint: 'Sun' }, { word: 'तारा', hint: 'Star' }, { word: 'चाँद', hint: 'Moon' }
    ],
    telugu: [
        { word: 'అమ్మ', hint: 'Mother' }, { word: 'నాన్న', hint: 'Father' }, { word: 'నీరు', hint: 'Water' },
        { word: 'పువ్వు', hint: 'Flower' }, { word: 'చెట్టు', hint: 'Tree' }, { word: 'ఆకాశం', hint: 'Sky' },
        { word: 'చదువు', hint: 'Study' }, { word: 'తెలుగు', hint: 'Telugu' }, { word: 'భారతదేశం', hint: 'India' },
        { word: 'పండు', hint: 'Fruit' }, { word: 'దేశం', hint: 'Country' }, { word: 'భాష', hint: 'Language' }
    ],
    malayalam: [
        { word: 'അമ്മ', hint: 'Mother' }, { word: 'അച്ഛൻ', hint: 'Father' }, { word: 'പൂവ്', hint: 'Flower' },
        { word: 'മരം', hint: 'Tree' }, { word: 'വെള്ളം', hint: 'Water' }, { word: 'ആകാശം', hint: 'Sky' },
        { word: 'മലയാളം', hint: 'Malayalam' }, { word: 'ഭാരതം', hint: 'India' }, { word: 'കുട്ടി', hint: 'Child' },
        { word: 'ഭാഷ', hint: 'Language' }, { word: 'നാട്', hint: 'Village' }, { word: 'സ്നേഹം', hint: 'Love' }
    ],
    kannada: [
        { word: 'ಅಮ್ಮ', hint: 'Mother' }, { word: 'ಅಪ್ಪ', hint: 'Father' }, { word: 'ಹೂವು', hint: 'Flower' },
        { word: 'ಮರ', hint: 'Tree' }, { word: 'ನೀರು', hint: 'Water' }, { word: 'ಆಕಾಶ', hint: 'Sky' },
        { word: 'ಕನ್ನಡ', hint: 'Kannada' }, { word: 'ಭಾರತ', hint: 'India' }, { word: 'ಶಾಲೆ', hint: 'School' },
        { word: 'ಪುಸ್ತಕ', hint: 'Book' }, { word: 'ಭಾಷೆ', hint: 'Language' }, { word: 'ಪ್ರೀತಿ', hint: 'Love' }
    ],
    english: [
        { word: 'LION', hint: 'King of the jungle 🦁' },
        { word: 'TIGER', hint: 'India\'s national animal 🐅' },
        { word: 'APPLE', hint: 'A fruit that keeps the doctor away 🍎' },
        { word: 'WATER', hint: 'We drink this when thirsty 💧' },
        { word: 'SMILE', hint: 'What you do when you are happy 😊' },
        { word: 'HAPPY', hint: 'The opposite of sad!' },
        { word: 'BREAD', hint: 'Used to make sandwiches 🥪' },
        { word: 'CLOUD', hint: 'White fluffy thing in the sky ☁️' },
        { word: 'DREAM', hint: 'What you see when you sleep 😴' },
        { word: 'NEST', hint: 'A house for a bird 🪺' },
        { word: 'FAST', hint: 'Running very quickly like a car 🏎️' },
        { word: 'BEST', hint: 'Number one or superior! 🏆' },
        { word: 'PAST', hint: 'Things that happened yesterday 🕰️' },
        { word: 'PEACOCK', hint: 'The national bird of India 🦚' },
        { word: 'MANGO', hint: 'The king of fruits 🥭' },
        { word: 'LOTUS', hint: 'The national flower of India 🪷' },
        { word: 'INDIA', hint: 'The country we live in! 🇮🇳' }
    ]
};

const Games = () => {
    const { language: urlLanguage } = useParams();
    const { user } = useAuth();
    const [selectedGame, setSelectedGame] = useState(null);
    const selectedLanguage = (urlLanguage || user?.enrolledLanguages?.[0] || 'tamil').toLowerCase();

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative bg-slate-50 overflow-hidden">
            <div className="max-w-[1280px] mx-auto relative z-10 w-full h-full">
                {!selectedGame ? (
                    <div className="text-center py-20 flex flex-col items-center justify-center min-h-[60vh]">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                            className="text-6xl font-black text-slate-800 mb-12 tracking-tighter uppercase"
                        >
                            {selectedLanguage} Games Hub
                        </motion.h1>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            onClick={() => setSelectedGame('vortex')}
                            className="cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-800 p-12 rounded-[3rem] inline-block shadow-2xl border-4 border-white/20"
                        >
                            <div className="text-8xl mb-4">🌀</div>
                            <h2 className="text-3xl font-black text-white uppercase tracking-widest">Word Vortex</h2>
                            <p className="mt-4 text-xs font-bold bg-white/20 px-6 py-1.5 rounded-full text-white/80 uppercase tracking-widest">2,000 Levels</p>
                        </motion.div>
                    </div>
                ) : (
                    <div className="relative h-full">
                        <button
                            onClick={() => setSelectedGame(null)}
                            className="absolute -top-10 left-4 bg-slate-800 hover:bg-black text-white px-6 py-2 rounded-full font-black z-[200] shadow-xl transition-all border-2 border-white/10 text-xs tracking-widest"
                        >
                            BACK
                        </button>
                        <WordVortex language={selectedLanguage} />
                    </div>
                )}
            </div>
        </div>
    );
};

const WordVortex = ({ language }) => {
    const { user, updateUser } = useAuth();
    const [level, setLevel] = useState(1);
    const [foundWords, setFoundWords] = useState([]);
    const [revealedChars, setRevealedChars] = useState({});
    const [currentSelection, setCurrentSelection] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const circleRef = useRef(null);

    const splitIntoUnits = (str) => {
        if (!str) return [];
        const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
        return Array.from(segmenter.segment(str)).map(s => s.segment);
    };

    const currentLevelData = useMemo(() => {
        const lib = WORD_LIBRARY[language] || WORD_LIBRARY.english;
        const count = 3;
        const selected = [...lib].sort(() => 0.5 - Math.random()).slice(0, count);

        const grid = selected.map((pair, i) => {
            const units = splitIntoUnits(pair.word);
            return {
                ...pair,
                units,
                row: i * 2,
                col: i % 2 === 0 ? 0 : 1,
                dir: 'h'
            };
        });

        let dialLetters = [];
        selected.forEach(p => {
            const units = splitIntoUnits(p.word);
            const freq = {};
            units.forEach(u => freq[u] = (freq[u] || 0) + 1);
            Object.keys(freq).forEach(u => {
                const existing = dialLetters.filter(l => l === u).length;
                if (freq[u] > existing) {
                    for (let k = 0; k < (freq[u] - existing); k++) dialLetters.push(u);
                }
            });
        });

        while (dialLetters.length < 6) {
            dialLetters.push(splitIntoUnits(lib[Math.floor(Math.random() * lib.length)].word)[0]);
        }

        return {
            level,
            dialLetters: dialLetters.sort(() => Math.random() - 0.5),
            grid,
            words: selected.map(p => p.word)
        };
    }, [level, language]);

    // DYNAMIC MEDIUM SCALE METRICS
    const dialMetrics = useMemo(() => {
        const count = currentLevelData.dialLetters.length;
        let baseRadius = 135;
        let btnSize = "w-16 h-16 text-3xl";
        let containerSize = 350;

        // Dynamic adjustment to prevent "conjuted" (congested) layout
        if (count > 8) {
            baseRadius = 155;
            btnSize = "w-14 h-14 text-2xl";
            containerSize = 400;
        }

        return { baseRadius, btnSize, containerSize };
    }, [currentLevelData.dialLetters]);

    useEffect(() => {
        setFoundWords([]);
        setRevealedChars({});
        setCurrentSelection([]);
    }, [level]);

    const handleHint = () => {
        if (!user || user.diamonds < 10) {
            setFeedback({ text: 'Need 10 Gems! 💎', type: 'info' });
            setTimeout(() => setFeedback(null), 1000);
            return;
        }

        const unrevealedCells = [];
        currentLevelData.grid.forEach(item => {
            if (!foundWords.includes(item.word)) {
                item.units.forEach((unit, idx) => {
                    const r = item.dir === 'h' ? item.row : item.row + idx;
                    const c = item.dir === 'h' ? item.col + idx : item.col;
                    const key = `${r}-${c}`;
                    if (!revealedChars[key]) {
                        unrevealedCells.push({ key, char: unit });
                    }
                });
            }
        });

        if (unrevealedCells.length === 0) return;

        const random = unrevealedCells[Math.floor(Math.random() * unrevealedCells.length)];
        setRevealedChars(prev => ({ ...prev, [random.key]: random.char }));
        updateUser({ diamonds: (user.diamonds || 0) - 10 });
        setFeedback({ text: 'Hint Revealed! 🪄', type: 'success' });
        setTimeout(() => setFeedback(null), 1000);
    };

    const handlePointerDown = (idx) => {
        setIsDragging(true);
        setCurrentSelection([idx]);
    };

    const handlePointerEnter = (idx) => {
        if (isDragging && !currentSelection.includes(idx)) {
            setCurrentSelection([...currentSelection, idx]);
        }
    };

    const checkSolution = () => {
        const attempt = currentSelection.map(i => currentLevelData.dialLetters[i]).join('');
        if (currentLevelData.words.includes(attempt) && !foundWords.includes(attempt)) {
            setFoundWords([...foundWords, attempt]);
            setFeedback({ text: 'GOOD! ✨', type: 'success' });
            if (foundWords.length + 1 === currentLevelData.words.length) {
                setTimeout(() => setFeedback({ text: 'LEVEL CLEAR! 🏆', type: 'win' }), 400);
            }
        } else if (foundWords.includes(attempt)) {
            setFeedback({ text: 'Found!', type: 'info' });
        }
        setTimeout(() => setFeedback(null), 1000);
        setCurrentSelection([]);
    };

    useEffect(() => {
        const up = () => { if (isDragging) { setIsDragging(false); checkSolution(); } };
        window.addEventListener('pointerup', up);
        return () => window.removeEventListener('pointerup', up);
    }, [isDragging, currentSelection]);

    return (
        <div className="relative min-h-[85vh] rounded-[3rem] overflow-hidden flex flex-col items-center bg-slate-900 shadow-2xl border-4 border-white/5 mx-auto max-w-4xl">
            {/* Background */}
            <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format" className="w-full h-full object-cover opacity-20" alt="bg" />
            </div>

            {/* TOP BAR */}
            <div className="relative z-20 w-full px-8 py-6 flex justify-between items-center text-white pointer-events-none">
                <div className="bg-white/10 backdrop-blur-xl px-6 py-2 rounded-full border border-white/10 flex items-center gap-3">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="font-black text-sm uppercase italic">LEVEL {level}</span>
                    <div className="w-px h-4 bg-white/20 mx-1" />
                    <span className="text-yellow-400 font-bold text-sm">💎 {user?.diamonds || 0}</span>
                </div>

                <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/5 min-w-[200px] pointer-events-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-emerald-500" />
                        <span className="text-white/40 font-black uppercase text-[10px] tracking-widest">Targets</span>
                    </div>
                    {currentLevelData.grid.map((p, i) => (
                        <div key={i} className={`text-lg font-bold flex items-center gap-2 ${foundWords.includes(p.word) ? 'text-emerald-500 opacity-30 line-through' : 'text-white'}`}>
                            <div className={`w-2 h-2 rounded-full ${foundWords.includes(p.word) ? 'bg-emerald-500' : 'bg-white/20'}`} />
                            {p.hint}
                        </div>
                    ))}
                </div>
            </div>

            {/* MEDIUM GRID AREA */}
            <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center -mt-6">
                <div className="p-8 rounded-[2rem] backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl">
                    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
                        {[...Array(6)].map((_, r) => (
                            [...Array(6)].map((_, c) => {
                                const item = currentLevelData.grid.find(g => {
                                    if (g.dir === 'h') return g.row === r && c >= g.col && c < g.col + g.units.length;
                                    return g.col === c && r >= g.row && r < g.row + g.units.length;
                                });
                                if (!item) return <div key={`${r}-${c}`} className="w-11 h-11" />;
                                const found = foundWords.includes(item.word);
                                const unitIdx = item.dir === 'h' ? c - item.col : r - item.row;
                                const key = `${r}-${c}`;
                                const isHinted = revealedChars[key];

                                return (
                                    <motion.div
                                        key={`${r}-${c}`}
                                        animate={{ backgroundColor: (found || isHinted) ? '#2563eb' : 'rgba(255,255,255,0.05)' }}
                                        className={`w-11 h-11 rounded-lg border-2 ${(found || isHinted) ? 'border-white' : 'border-white/10'} flex items-center justify-center text-2xl font-black text-white`}
                                    >
                                        {(found || isHinted) ? item.units[unitIdx] : ''}
                                    </motion.div>
                                );
                            })
                        ))}
                    </div>
                </div>
            </div>

            {/* MEDIUM DIAL AREA */}
            <div className="relative z-30 w-full flex flex-col items-center justify-center pb-16 pt-6">
                <AnimatePresence>
                    {currentSelection.length > 0 && (
                        <motion.div
                            initial={{ scale: 0, y: 30 }} animate={{ scale: 1.1, y: -60 }} exit={{ scale: 0 }}
                            className="absolute bg-blue-600 px-8 py-3 rounded-full text-white text-3xl font-black shadow-2xl border-2 border-white z-[150]"
                        >
                            {currentSelection.map(i => currentLevelData.dialLetters[i]).join('')}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div
                    ref={circleRef}
                    style={{ width: dialMetrics.containerSize, height: dialMetrics.containerSize }}
                    className="relative rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 shadow-inner flex items-center justify-center"
                >
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        {currentSelection.length > 1 && currentSelection.slice(1).map((idx, i) => {
                            const prev = currentSelection[i];
                            const center = dialMetrics.containerSize / 2;
                            const p1 = {
                                x: center + dialMetrics.baseRadius * Math.cos((prev * 360 / currentLevelData.dialLetters.length - 90) * Math.PI / 180),
                                y: center + dialMetrics.baseRadius * Math.sin((prev * 360 / currentLevelData.dialLetters.length - 90) * Math.PI / 180)
                            };
                            const p2 = {
                                x: center + dialMetrics.baseRadius * Math.cos((idx * 360 / currentLevelData.dialLetters.length - 90) * Math.PI / 180),
                                y: center + dialMetrics.baseRadius * Math.sin((idx * 360 / currentLevelData.dialLetters.length - 90) * Math.PI / 180)
                            };
                            return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="white" strokeWidth="12" strokeLinecap="round" opacity="0.5" />;
                        })}
                    </svg>

                    {currentLevelData.dialLetters.map((letter, idx) => {
                        const angle = (idx * 360 / currentLevelData.dialLetters.length) - 90;
                        const x = dialMetrics.baseRadius * Math.cos(angle * Math.PI / 180);
                        const y = dialMetrics.baseRadius * Math.sin(angle * Math.PI / 180);
                        const isSelected = currentSelection.includes(idx);
                        return (
                            <motion.div
                                key={`${level}-${idx}`}
                                onPointerDown={() => handlePointerDown(idx)}
                                onPointerEnter={() => handlePointerEnter(idx)}
                                className="absolute cursor-pointer select-none touch-none z-[160]"
                                style={{ x, y }}
                                animate={{ scale: isSelected ? 1.2 : 1 }}
                            >
                                <div className={`${dialMetrics.btnSize} rounded-full flex items-center justify-center font-black shadow-lg border-2 ${isSelected ? 'bg-blue-600 text-white border-white' : 'bg-white text-slate-900 border-transparent'
                                    }`}>
                                    {letter}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Nav & Hint */}
                <div className="mt-8 flex items-center gap-8">
                    <button onClick={() => setLevel(prev => Math.max(1, prev - 1))} className="p-3 bg-white/5 rounded-full text-white border border-white/10 hover:bg-white/20 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleHint}
                        className="bg-gradient-to-t from-orange-600 to-yellow-400 p-5 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.4)] border-2 border-white flex flex-col items-center justify-center group relative"
                    >
                        <Lightbulb className="w-7 h-7 text-white group-hover:animate-pulse" />
                        <span className="text-[10px] font-black text-white mt-1">HINT (10💎)</span>
                    </motion.button>

                    <button onClick={() => setLevel(prev => prev + 1)} className="p-3 bg-white/5 rounded-full text-white border border-white/10 hover:bg-white/20 transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Victory */}
            {feedback?.type === 'win' && (
                <div className="absolute inset-0 z-[500] flex items-center justify-center bg-black/90 backdrop-blur-xl">
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-12 rounded-[3rem] text-center border-8 border-yellow-400 max-w-sm w-full shadow-2xl">
                        <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-6 animate-bounce" />
                        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">VICTORY</h2>
                        <button onClick={() => setLevel(prev => prev + 1)} className="mt-8 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xl w-full shadow-xl">NEXT LEVEL</button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Games;
