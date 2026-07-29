import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-slate-200/60 dark:border-slate-800">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black">Reset Password</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter your registered email to receive password reset instructions</p>
          </div>

          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h3 className="font-bold text-lg">Check Your Email</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                We sent a password reset link to <strong className="text-slate-800 dark:text-white">{email}</strong>.
              </p>
              <Link to="/login" className="inline-block mt-4 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Back to Sign In →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
