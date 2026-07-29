import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const XPNotification = ({ amount, source, visible, onComplete }) => {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onComplete, 3000);
            return () => clearTimeout(timer);
        }
    }, [visible, onComplete]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, scale: 0.5, x: '-50%' }}
                    className="fixed bottom-24 left-1/2 z-[9999] bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 rounded-full shadow-2xl border-2 border-white/20 flex items-center gap-4 text-white"
                >
                    <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center font-black text-xl">
                        ✨
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black leading-none">+{amount} XP</span>
                        <span className="text-xs font-bold opacity-80 uppercase tracking-widest">{source}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default XPNotification;
