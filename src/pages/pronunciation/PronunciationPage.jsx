import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { Mic, Volume2, Sparkles, RefreshCw, CheckCircle, AlertCircle, Play, Square, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PronunciationPage = () => {
  const [recording, setRecording] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const samplePhrases = [
    { phrase: 'Por favor, ¿dónde está el baño?', language: 'Spanish', phonetic: 'pohr fah-VOHR, DOHN-deh ehs-TAH ehl BAH-nyoh?', translation: 'Please, where is the bathroom?' },
    { phrase: 'Bonjour, comment allez-vous aujourd’hui?', language: 'French', phonetic: 'bohn-ZHOOR, koh-mahn tah-lay VOO oh-zhoor-DWEE?', translation: 'Hello, how are you today?' },
    { phrase: 'Guten Morgen, wie geht es Ihnen?', language: 'German', phonetic: 'GOO-ten MOR-gen, vee GAYT es EE-nen?', translation: 'Good morning, how are you?' },
  ];

  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const activePhrase = samplePhrases[activePhraseIndex];

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleStartRecord = () => {
    setRecording(true);
    setResult(null);

    setTimeout(() => {
      setRecording(false);
      setAnalyzing(true);

      setTimeout(() => {
        setAnalyzing(false);
        setResult({
          overallScore: 94,
          accuracy: '96% Match',
          fluency: '92% Speed',
          intonation: '94% Natural',
          feedback: 'Excellent pronunciation! Clear syllable emphasis on "dónde" and smooth vowel transitions.',
        });
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      }, 1500);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-24 md:pb-8 min-w-0">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <Mic className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                AI Pronunciation Lab
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Speak into your microphone to analyze pitch, accent fidelity, and syllable intonation
            </p>
          </div>

          {/* Selector */}
          <div className="glass-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Select Practice Sentence
              </span>
              <div className="flex gap-2">
                {samplePhrases.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setActivePhraseIndex(idx); setResult(null); }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      activePhraseIndex === idx
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Phrase Box */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600/10 via-purple-500/5 to-teal-500/10 border border-blue-500/20 text-center space-y-3">
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-500/15 text-blue-500 uppercase">
                {activePhrase.language} Target
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
                "{activePhrase.phrase}"
              </h2>
              <p className="text-xs font-mono text-purple-500 dark:text-purple-400">
                [{activePhrase.phonetic}]
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                Translation: "{activePhrase.translation}"
              </p>

              <button
                onClick={() => speak(activePhrase.phrase)}
                className="mt-4 inline-flex items-center gap-2 btn-primary text-xs py-2 px-4 shadow-lg shadow-blue-500/20"
              >
                <Volume2 className="w-4 h-4" /> Listen Native Speaker
              </button>
            </div>

            {/* Mic Record Interactive Area */}
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              <button
                onClick={handleStartRecord}
                disabled={recording || analyzing}
                className={`w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all ${
                  recording
                    ? 'bg-rose-500 text-white animate-pulse ring-8 ring-rose-500/30'
                    : analyzing
                    ? 'bg-amber-500 text-white animate-spin'
                    : 'bg-gradient-to-tr from-purple-600 to-blue-500 text-white hover:scale-105 active:scale-95'
                }`}
              >
                <Mic className="w-8 h-8 mb-1" />
                <span className="text-[10px] font-black uppercase">
                  {recording ? 'Recording...' : analyzing ? 'Analyzing...' : 'Tap & Speak'}
                </span>
              </button>

              {recording && (
                <div className="flex items-center gap-1.5 h-8">
                  <div className="w-1.5 h-6 bg-rose-500 animate-bounce" />
                  <div className="w-1.5 h-8 bg-rose-500 animate-bounce delay-100" />
                  <div className="w-1.5 h-4 bg-rose-500 animate-bounce delay-200" />
                  <div className="w-1.5 h-7 bg-rose-500 animate-bounce delay-300" />
                </div>
              )}
            </div>

            {/* Analysis Result Card */}
            {result && (
              <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      AI Accent Breakdown Score
                    </h3>
                  </div>
                  <span className="text-lg font-black text-emerald-500">
                    {result.overallScore} / 100
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Accuracy</span>
                    <span className="text-xs font-black text-emerald-500">{result.accuracy}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Fluency</span>
                    <span className="text-xs font-black text-blue-500">{result.fluency}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 text-center">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Intonation</span>
                    <span className="text-xs font-black text-purple-500">{result.intonation}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  💡 {result.feedback}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default PronunciationPage;
