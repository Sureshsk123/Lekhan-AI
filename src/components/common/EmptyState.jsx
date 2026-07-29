import React from 'react';

export const EmptyState = ({ title, description, icon: Icon, actionButton }) => {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
      {Icon && (
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-4 border border-emerald-500/20 shadow-inner">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          {description}
        </p>
      )}
      {actionButton && <div className="mt-5">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
