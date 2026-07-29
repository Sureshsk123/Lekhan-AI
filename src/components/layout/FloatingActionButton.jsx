import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';

export const FloatingActionButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/ai-tutor')}
      className="fixed bottom-20 lg:bottom-8 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-white shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all group flex items-center gap-2 font-bold text-sm"
      title="Ask AI Tutor"
    >
      <Bot className="w-6 h-6 animate-bounce" />
      <span className="hidden sm:inline-block pr-1">AI Tutor</span>
    </button>
  );
};

export default FloatingActionButton;
