import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { isAllowedEmail } from '../../utils/authValidation';

const EMAIL_HINT = 'Please enter a valid email address.';

export const LoginPage = () => {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe]   = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);

  const { login }  = useAuth();
  const navigate   = useNavigate();

  const validate = () => {
    if (!email)               return 'Email is required';
    if (!isAllowedEmail(email)) return EMAIL_HINT;
    if (!password)            return 'Password is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    const res = await login(email.trim().toLowerCase(), password, rememberMe);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-content-primary text-surface-primary rounded-lg font-bold text-sm mb-4">
          LS
        </div>
        <h1 className="text-2xl font-semibold text-content-primary">Welcome back</h1>
        <p className="mt-1 text-sm text-content-secondary">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-content-primary underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>

      {/* Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-surface-primary border border-border-light rounded-xl shadow-sm px-8 py-8">

          {error && (
            <div role="alert" className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-content-secondary mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                placeholder="you@example.com"
                className="block w-full px-3 py-2.5 rounded-lg border border-border-strong text-sm text-content-primary bg-surface-primary placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-content-primary/20 focus:border-content-primary transition-colors"
              />
              {/* Inline hint — only shown while typing an invalid domain */}
              {email && !isAllowedEmail(email) && (
                <p className="mt-1 text-xs text-amber-600">Please enter a valid email address.</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="text-sm font-medium text-content-secondary">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-content-secondary hover:text-content-primary underline underline-offset-2"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                  placeholder="••••••••••••"
                  className="block w-full px-3 py-2.5 pr-10 rounded-lg border border-border-strong text-sm text-content-primary bg-surface-primary placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-content-primary/20 focus:border-content-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-secondary focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border-strong focus:ring-content-primary"
              />
              <label htmlFor="remember-me" className="text-sm text-content-secondary">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg bg-content-primary text-surface-primary text-sm font-medium hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-content-primary transition-colors disabled:opacity-50"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-surface-primary/40 border-t-surface-primary rounded-full animate-spin" />
                : 'Sign in'
              }
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs text-content-tertiary">
          &copy; 2026 LangSphere AI. Developed at SIMATS Engineering.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
