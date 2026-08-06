import React from 'react';

export const BarChart = ({ data = [], height = 150 }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.value || d.xp || 1), 10);

  return (
    <div className="w-full flex items-end justify-between gap-1.5 pt-4 pb-1" style={{ height }}>
      {data.map((item, idx) => {
        const val = item.value || item.xp || 0;
        const pct = Math.min(Math.round((val / max) * 100), 100);
        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="w-full bg-slate-100 dark:bg-slate-700/60 rounded-xl h-full flex items-end p-0.5 relative overflow-hidden">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-teal-400 rounded-lg transition-all duration-500 group-hover:from-emerald-400 group-hover:to-teal-300"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 truncate w-full text-center">
              {item.day || item.label || item.date?.split('-').slice(1).join('/') || `D${idx + 1}`}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const ProgressRing = ({ progress = 0, size = 120, strokeWidth = 10, label = '' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#emerald-gradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-slate-800 dark:text-white">{progress}%</span>
        {label && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>}
      </div>
    </div>
  );
};

export default {
  BarChart,
  ProgressRing
};
