import React from 'react';

export const GlassCard = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`rounded-3xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xl shadow-xl shadow-slate-200/20 dark:shadow-slate-900/40 p-6 transition-all duration-300 ${
        hover ? 'hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
