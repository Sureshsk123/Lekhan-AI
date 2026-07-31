import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-surface-primary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className={`w-full ${maxWidth} bg-surface-primary rounded-3xl shadow-2xl border border-border-light overflow-hidden transform transition-all`}>
        <div className="flex items-center justify-between p-5 border-b border-border-light">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
