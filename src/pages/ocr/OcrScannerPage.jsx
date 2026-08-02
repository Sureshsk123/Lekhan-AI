import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Sidebar from '../../components/layout/Sidebar';
import MobileBottomNav from '../../components/layout/MobileBottomNav';
import { ScanText, Upload, Camera, Image as ImageIcon, Copy, Bookmark, Check, Sparkles, RefreshCw, AlertCircle, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OcrScannerPage = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const sampleScans = [
    {
      title: 'Restaurant Menu (Spanish)',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      text: 'Entradas: Croquetas de Jamón Ibérico - 8,50 €\nPlato Principal: Paella de Mariscos con Arroz Caldoso - 18,00 €\nPostre: Flan de Huevo Casero con Nata - 5,00 €',
      confidence: 98,
      grammarNotes: '“Croquetas de Jamón” uses the preposition “de” for composition. “Mariscos” refers to shellfish.',
    },
    {
      title: 'Book Page (French)',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      text: 'Le soleil se levait doucement sur les collines dorées de la Provence. Les oiseaux chantaient dans les oliviers centenaires.',
      confidence: 96,
      grammarNotes: '“Se levait” is in the imparfait tense (past continuous action). “Doucement” is an adverb ending in -ment.',
    },
  ];

  const handleSelectSample = (sample) => {
    setPreviewUrl(sample.image);
    setScanning(true);
    setExtractedData(null);
    setTimeout(() => {
      setScanning(false);
      setExtractedData(sample);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }, 1500);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewUrl(url);
      processOcr(url);
    }
  };

  const processOcr = (url) => {
    setScanning(true);
    setExtractedData(null);
    setTimeout(() => {
      setScanning(false);
      setExtractedData({
        title: 'Uploaded Document',
        image: url,
        text: 'Hola mi amigo! Bienvenida a nuestra lección de conversación en español. ¿Cómo estás hoy?',
        confidence: 97,
        grammarNotes: '“Bienvenida” is feminine form of welcome. “¿Cómo estás?” uses the informal second-person singular.',
      });
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }, 2000);
  };

  const handleCopy = () => {
    if (extractedData?.text) {
      navigator.clipboard.writeText(extractedData.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6 pb-24 md:pb-8 min-w-0">
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <ScanText className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                  AI OCR Scanner
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Scan signs, menus, books or hand-written notes to instantly translate & analyze grammar
              </p>
            </div>
          </div>

          {/* Scanner Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Upload & Preview Box */}
            <div className="glass-card p-6 flex flex-col space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span>1. Upload or Select Image</span>
                {previewUrl && (
                  <button
                    onClick={() => { setPreviewUrl(null); setExtractedData(null); }}
                    className="text-xs text-rose-500 font-semibold hover:underline"
                  >
                    Clear Image
                  </button>
                )}
              </h3>

              {/* Upload Drop Zone */}
              <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-3xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden min-h-[260px] flex flex-col items-center justify-center">
                {previewUrl ? (
                  <div className="relative w-full h-64 rounded-2xl overflow-hidden group">
                    <img src={previewUrl} alt="Scan preview" className="w-full h-full object-cover" />
                    {scanning && (
                      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center">
                        <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-amber-400 absolute top-0 animate-bounce shadow-lg shadow-blue-500" />
                        <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mb-2" />
                        <span className="text-xs font-extrabold text-white">Extracting text with AI OCR...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">
                        Click or Drag & Drop Image Here
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Supports PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Sample Presets */}
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                  Or Try Sample Scans:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {sampleScans.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(sample)}
                      className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-800/60 hover:border-blue-500/50 text-left transition-all flex items-center gap-3 group"
                    >
                      <img src={sample.image} alt={sample.title} className="w-10 h-10 rounded-xl object-cover" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate group-hover:text-blue-500">
                          {sample.title}
                        </p>
                        <span className="text-[10px] text-teal-500 font-extrabold">Instant Scan</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: AI Output & Grammar Breakdown */}
            <div className="glass-card p-6 flex flex-col space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  2. Extracted Text & AI Analysis
                </h3>
                {extractedData && (
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                    {extractedData.confidence}% Confidence
                  </span>
                )}
              </div>

              {!extractedData && !scanning && (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center text-slate-400">
                  <ScanText className="w-12 h-12 stroke-[1.5] text-slate-300 dark:text-slate-700 mb-3" />
                  <p className="text-xs font-semibold">Select or upload an image to view OCR text</p>
                </div>
              )}

              {scanning && (
                <div className="flex-1 flex flex-col items-center justify-center py-16 space-y-3">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold text-slate-400">Processing computer vision tensor model...</span>
                </div>
              )}

              {extractedData && !scanning && (
                <div className="space-y-4 animate-in fade-in">
                  {/* Extracted Box */}
                  <div>
                    <label className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1.5">
                      Extracted Foreign Text
                    </label>
                    <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-sm leading-relaxed border border-slate-800 relative group">
                      <p className="whitespace-pre-line">{extractedData.text}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCopy}
                      className="flex-1 btn-secondary text-xs py-2.5 flex items-center justify-center gap-2"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 btn-primary text-xs py-2.5 flex items-center justify-center gap-2"
                    >
                      {saved ? <Check className="w-4 h-4 text-white" /> : <Bookmark className="w-4 h-4" />}
                      <span>{saved ? 'Saved to Vocabulary!' : 'Save to Vocab'}</span>
                    </button>
                  </div>

                  {/* AI Grammar & Vocabulary Notes */}
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                    <h4 className="text-xs font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> AI Linguistic Breakdown
                    </h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {extractedData.grammarNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default OcrScannerPage;
