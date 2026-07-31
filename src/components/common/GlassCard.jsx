import React from 'react';

export const GlassCard = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`rounded-3xl bg-surface-primary/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xl shadow-xl shadow-sm dark:shadow-sm p-6 transition-all duration-300 ${
        hover ? 'hover:shadow-2xl hover:shadow-sm hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
