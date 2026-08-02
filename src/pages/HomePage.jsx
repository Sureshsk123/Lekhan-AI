import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, BookOpen, Sparkles, ArrowRight, Bot, PenTool, ScanText, Trophy, ShieldCheck, Flame, Zap, CheckCircle2, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      {/* Glow Orbs Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Sticky Glass Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-teal-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-extrabold text-xl">
                <Sparkles className="w-5 h-5 text-teal-400 animate-pulse-subtle" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold font-heading text-white tracking-tight">
                LangSphere
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                AI
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-primary text-xs py-2.5 px-5 shadow-lg shadow-blue-500/30"
              >
                Go to Smart Dashboard →
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <button
                  onClick={() => navigate('/signup')}
                  className="btn-primary text-xs py-2.5 px-5 shadow-lg shadow-blue-500/30"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-extrabold mb-6 animate-float">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation AI Language Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight text-white max-w-5xl leading-[1.1] mb-6">
          Master languages with <br />
          <span className="text-gradient">Intelligent AI Precision.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          LangSphere AI combines adaptive learning paths, real-time voice tutoring, computer vision handwriting analysis, and dual-language interactive stories into a single sleek ecosystem.
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-16">
          <button
            onClick={() => navigate(user ? '/dashboard' : '/signup')}
            className="w-full sm:w-auto btn-primary text-sm py-3.5 px-8 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/30 group"
          >
            <span>{user ? 'Open Dashboard' : 'Start Learning Free'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#features"
            className="w-full sm:w-auto btn-secondary text-sm py-3.5 px-8 flex items-center justify-center gap-2"
          >
            Explore Platform
          </a>
        </div>

        {/* Hero Interactive App Mockup Frame */}
        <div className="w-full max-w-5xl rounded-3xl p-3 bg-gradient-to-b from-blue-500/30 via-slate-800/40 to-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-2xl relative">
          <div className="w-full bg-slate-900/90 rounded-2xl p-6 sm:p-8 border border-slate-800 text-left grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Mock Chat Box */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-400 ml-2">ai-tutor.langsphere.app</span>
                </div>
                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Gemini AI Active
                </span>
              </div>

              <div className="space-y-3 font-sans text-xs">
                <div className="p-3.5 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-200 max-w-lg">
                  <p className="font-bold mb-1">🤖 LangSphere AI Tutor:</p>
                  <p>¡Hola! ¿Cómo estás hoy? Let's practice ordering coffee in Spanish!</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800 text-slate-200 ml-auto max-w-xs text-right border border-slate-700">
                  Quisiera un café con leche por favor.
                </div>
                <div className="p-3.5 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-200 max-w-lg">
                  <p className="font-bold mb-1">✨ AI Feedback:</p>
                  <p>Perfect sentence structure! 100% grammar accuracy. +15 XP earned!</p>
                </div>
              </div>
            </div>

            {/* Mock Live Stats */}
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Live Student Progress</span>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Daily Streak</span>
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" /> 7 Days
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Level 5 Explorer</span>
                  <span className="text-xs font-black text-blue-400">1,240 XP</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-600 text-white text-center font-bold text-xs shadow-lg shadow-blue-500/30">
                🚀 Resume Spanish Unit 3
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-24 bg-slate-900/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white">
              Everything You Need to Achieve Fluency.
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              An all-in-one ecosystem designed for fast progress, deep retention, and commercial-grade usability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="glass-card p-8 space-y-4 glass-card-hover border-slate-800">
              <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">ChatGPT-Quality AI Tutor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Engage in natural conversations with streaming Gemini AI, receiving instant grammar feedback, syntax correction, and native voice synthesis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 space-y-4 glass-card-hover border-slate-800">
              <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Handwriting Canvas AI</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Draw foreign characters on an HTML5 canvas and receive real-time stroke accuracy evaluation and letter formation guidance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 space-y-4 glass-card-hover border-slate-800">
              <div className="p-3.5 rounded-2xl bg-teal-500/10 text-teal-400 border border-teal-500/20 w-fit">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Duolingo Learning Path</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step-by-step skill tree nodes from Beginner to Expert. Earn XP, claim badges, and progress through structured units.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="glass-card p-8 space-y-4 glass-card-hover border-slate-800">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 w-fit">
                <ScanText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">OCR Photo Text Scanner</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Upload or snap photos of real-world menus, signs, or books to extract text, translate instantly, and save to your vocabulary deck.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="glass-card p-8 space-y-4 glass-card-hover border-slate-800">
              <div className="p-3.5 rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 w-fit">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Interactive Dual Reader</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Read foreign language stories with sentence translation toggles, instant tap-to-define word popups, and audio pronunciation.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="glass-card p-8 space-y-4 glass-card-hover border-slate-800">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Leaderboards & Parent Portal</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compete on global leaderboards, track 365-day heatmaps, and allow parents to monitor study time & accuracy analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 relative text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="glass-card p-12 bg-gradient-to-r from-blue-600/20 via-teal-500/10 to-purple-600/20 border-blue-500/30 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Start Your AI Language Journey?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
              Join thousands of scholars mastering Spanish, French, German, Japanese, Hindi, Tamil, Telugu, and Kannada today.
            </p>
            <button
              onClick={() => navigate(user ? '/dashboard' : '/signup')}
              className="btn-primary py-3.5 px-8 text-sm shadow-xl shadow-blue-500/40 inline-flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="font-extrabold text-white">LangSphere AI Platform</span>
          </div>
          <p className="text-slate-500">
            &copy; 2026 LangSphere AI. All rights reserved. Commercial-Grade AI Ecosystem.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
