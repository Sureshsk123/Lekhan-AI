import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bot, Sparkles } from 'lucide-react';

export const FloatingActionButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Hide FAB if on login/signup or already on AI tutor page
  if (!user || location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/ai-tutor') {
    return null;
  }

  return (
    <button
      onClick={() => navigate('/ai-tutor')}
      className="fixed bottom-20 md:bottom-8 right-6 z-40 p-3.5 sm:px-5 sm:py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-teal-400 text-white shadow-2xl shadow-blue-500/40 hover:scale-108 active:scale-95 transition-all duration-300 group flex items-center gap-3 font-extrabold text-xs sm:text-sm border border-white/20"
      title="Open AI Language Tutor"
      aria-label="Ask AI Tutor"
    >
      <div className="relative">
        <Bot className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-300 animate-ping" />
      </div>
      <span className="hidden sm:inline-block tracking-wide">Ask AI Tutor</span>
      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white font-black uppercase">
        Live
      </span>
    </button>
  );
};

export default FloatingActionButton;
