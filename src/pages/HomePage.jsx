import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Bot, Brain, BookOpen, Trophy, ShieldCheck, ArrowRight, Star } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300/50 text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
            <span>Next-Gen Gemini 3.6 AI Language Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
            Master Languages with <br />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Autonomous AI Intelligence
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium">
            LangSphere combines ChatGPT conversational tutoring, Gemini Vision OCR, handwriting stroke evaluation, cultural storybooks, and personalized weakness tracking into one gamified platform.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold text-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-md"
            >
              Sign In to Account
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { val: '96+', label: 'Interactive Lessons' },
              { val: '6+', label: 'Indic & Global Languages' },
              { val: '98%', label: 'AI Accuracy Rating' },
              { val: '100+', label: 'Gamified Achievements' }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md">
                <p className="text-3xl font-black text-emerald-500">{stat.val}</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-y border-slate-200/60 dark:border-slate-800/80">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Powered by Enterprise AI</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Built with dedicated AI tutors, Vision OCR, speech recognition, and automated handwriting stroke evaluation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Gemini AI Tutor', desc: 'Instant ChatGPT-style conversation tutor for Tamil, Hindi, Telugu, and English grammar.', icon: Bot, color: 'text-emerald-500' },
              { title: 'Handwriting Evaluator', desc: 'Real-time HTML5 stroke analysis evaluating character formation, spacing, and stroke consistency.', icon: Brain, color: 'text-teal-500' },
              { title: 'Vision OCR Scanner', desc: 'Scan ancient or handwritten text documents and receive instant corrections & grammar tips.', icon: Sparkles, color: 'text-cyan-500' }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl transition-all">
                  <Icon className={`w-10 h-10 ${f.color} mb-4`} />
                  <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 LangSphere Enterprise. All rights reserved. Powered by Google Gemini AI Engine.</p>
      </footer>
    </div>
  );
};

export default HomePage;
