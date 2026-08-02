import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { BookmarkCheck, Volume2, Search, Filter, RotateCw, Check, Sparkles, BrainCircuit, ArrowLeft, ArrowRight, Flame } from 'lucide-react';

export const VocabularyPage = () => {
  const [filter, setFilter] = useState('all'); // all, learning, review, mastered
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const initialWords = [
    {
      id: '1',
      word: 'Bienvenido',
      translation: 'Welcome',
      phonetic: 'bee-en-veh-NEE-doh',
      language: 'Spanish',
      status: 'mastered',
      example: '¡Bienvenido a nuestra casa, amigo!',
      mnemonic: 'Think of "Bien" (good) + "Venido" (venue/coming) = Good arrival!',
    },
    {
      id: '2',
      word: 'La Biblioteca',
      translation: 'The Library',
      phonetic: 'lah bee-blee-oh-TEH-kah',
      language: 'Spanish',
      status: 'learning',
      example: 'Voy a estudiar en la biblioteca esta tarde.',
      mnemonic: 'Sounds like "Bibliotheque" in French or "Bible" (book collection).',
    },
    {
      id: '3',
      word: 'Desayuno',
      translation: 'Breakfast',
      phonetic: 'deh-sah-YOO-noh',
      language: 'Spanish',
      status: 'review',
      example: 'El desayuno está listo en la mesa.',
      mnemonic: 'Des- (un-) + ayuno (fast) = Breaking the fast (Breakfast)!',
    },
    {
      id: '4',
      word: 'Cerveza',
      translation: 'Beer',
      phonetic: 'sehr-VEH-sah',
      language: 'Spanish',
      status: 'learning',
      example: 'Una cerveza fría, por favor.',
      mnemonic: 'Rhymes with "serve standard", think serving a drink at a festival.',
    },
    {
      id: '5',
      word: 'Por favor',
      translation: 'Please',
      phonetic: 'pohr fah-VOHR',
      language: 'Spanish',
      status: 'mastered',
      example: '¿Me das un vaso de agua, por favor?',
      mnemonic: 'Literally means "by favor" or doing someone a favor.',
    },
  ];

  const [words, setWords] = useState(initialWords);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredWords = words.filter(w => {
    const matchesFilter = filter === 'all' || w.status === filter;
    const matchesSearch = w.word.toLowerCase().includes(searchTerm.toLowerCase()) || w.translation.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const currentWord = filteredWords[activeCardIndex] || filteredWords[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setActiveCardIndex((prev) => (prev + 1) % (filteredWords.length || 1));
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setActiveCardIndex((prev) => (prev - 1 + filteredWords.length) % (filteredWords.length || 1));
  };

  const markStatus = (id, newStatus) => {
    setWords(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-24 md:pb-8 min-w-0">
          {/* Title Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-500 border border-teal-500/20">
                  <BookmarkCheck className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                  Vocabulary Flashcards
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Spaced repetition memory deck with AI mnemonics & pronunciation audio
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
              {['all', 'learning', 'review', 'mastered'].map((f) => (
                <button
                  key={f}
                  onClick={() => { setFilter(f); setActiveCardIndex(0); setIsFlipped(false); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    filter === f
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Flashcard Active Mode Section */}
          {filteredWords.length > 0 && currentWord ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* 3D Flip Card Container */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full max-w-lg h-80 perspective-1000 cursor-pointer group"
              >
                <div
                  className={`relative w-full h-full rounded-3xl transition-transform duration-500 transform-style-3d glass-card p-8 flex flex-col justify-between border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500/50 shadow-2xl ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Front Side */}
                  {!isFlipped ? (
                    <div className="flex flex-col h-full justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                          Card {activeCardIndex + 1} of {filteredWords.length} · {currentWord.language}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                            currentWord.status === 'mastered'
                              ? 'bg-emerald-500/15 text-emerald-500'
                              : currentWord.status === 'review'
                              ? 'bg-rose-500/15 text-rose-500'
                              : 'bg-amber-500/15 text-amber-500'
                          }`}
                        >
                          {currentWord.status}
                        </span>
                      </div>

                      <div className="text-center my-auto space-y-2">
                        <h2 className="text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                          {currentWord.word}
                        </h2>
                        <p className="text-xs font-mono text-blue-500 dark:text-blue-400">
                          [{currentWord.phonetic}]
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); speak(currentWord.word); }}
                          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 text-xs font-bold transition-colors"
                        >
                          <Volume2 className="w-4 h-4" /> Listen Pronunciation
                        </button>
                      </div>

                      <div className="text-center">
                        <span className="text-[11px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                          <RotateCw className="w-3.5 h-3.5" /> Tap card to flip & reveal meaning
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Back Side */
                    <div className="flex flex-col h-full justify-between rotate-y-180">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                          English Translation
                        </span>
                        <span className="text-xs font-extrabold text-blue-500">
                          {currentWord.word}
                        </span>
                      </div>

                      <div className="space-y-3 my-auto">
                        <h2 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                          "{currentWord.translation}"
                        </h2>

                        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 italic">
                          "{currentWord.example}"
                        </div>

                        <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-600 dark:text-teal-400 font-medium flex items-start gap-2">
                          <BrainCircuit className="w-4 h-4 shrink-0 mt-0.5" />
                          <span><strong>AI Memory Hook:</strong> {currentWord.mnemonic}</span>
                        </div>
                      </div>

                      <div className="flex justify-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={(e) => { e.stopPropagation(); markStatus(currentWord.id, 'review'); }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                        >
                          Needs Review
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); markStatus(currentWord.id, 'mastered'); }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                        >
                          Got It! (Mastered)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePrevCard}
                  className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-md"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-slate-500">
                  {activeCardIndex + 1} / {filteredWords.length}
                </span>
                <button
                  onClick={handleNextCard}
                  className="p-3 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center text-slate-400">
              <BookmarkCheck className="w-12 h-12 stroke-[1.5] mx-auto mb-2 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-semibold">No vocabulary words found for this filter</p>
            </div>
          )}

          {/* Vocabulary List Table */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                All Saved Vocabulary Words ({filteredWords.length})
              </h3>

              <div className="relative w-48 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search word..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredWords.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => speak(item.word)}
                      className="p-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{item.word}</p>
                      <p className="text-xs text-slate-400">{item.translation} · <span className="font-mono">{item.phonetic}</span></p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                      item.status === 'mastered'
                        ? 'bg-emerald-500/15 text-emerald-500'
                        : item.status === 'review'
                        ? 'bg-rose-500/15 text-rose-500'
                        : 'bg-amber-500/15 text-amber-500'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default VocabularyPage;
