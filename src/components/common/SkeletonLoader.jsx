import React from 'react';

export const SkeletonLoader = ({ count = 3, height = 'h-20', className = '' }) => {
  return (
    <div className="space-y-3 w-full animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`${height} w-full rounded-2xl bg-slate-200/80 dark:bg-slate-700/60 ${className}`}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;
