import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import {
  checkPasswordRequirements,
  getPasswordStrength,
} from '../../utils/authValidation';
import apiClient from '../../services/apiClient';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const passwordReqs = checkPasswordRequirements(password);
  const strength = getPasswordStrength(password);

  const reqItems = [
    { key: 'minLength', label: '12+ characters' },
    { key: 'uppercase', label: 'Uppercase letter' },
    { key: 'lowercase', label: 'Lowercase letter' },
    { key: 'number', label: 'Number' },
    { key: 'special', label: 'Special character' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing reset token. Please request a new link.');
      return;
    }

    const allMet = Object.values(passwordReqs).every(Boolean);
    if (!allMet) {
      setError('Password does not meet the requirements listed below.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/v1/auth/reset-password', { token, newPassword: password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-7 h-7 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-content-primary mb-1">Password reset!</h2>
          <p className="text-sm text-content-secondary">Redirecting you to the sign in page…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-content-primary text-surface-primary rounded-lg font-bold text-sm mb-4">
          LS
        </div>
        <h1 className="text-2xl font-semibold text-content-primary">Set a new password</h1>
        <p className="mt-1 text-sm text-content-secondary">
          Remember it?{' '}
          <Link to="/login" className="font-medium text-content-primary underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-surface-primary border border-border-light rounded-xl shadow-sm px-8 py-8">

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {!token && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
              No reset token found. Please request a new password reset link.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* New Password */}
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-content-secondary mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Minimum 12 characters"
                  className="block w-full px-3 py-2.5 pr-10 rounded-lg border border-border-strong text-sm text-content-primary bg-surface-primary placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-content-primary/20 focus:border-content-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-secondary"
                  aria-label="Toggle visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength meter */}
              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-border-light rounded-full overflow-hidden flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="flex-1 h-full rounded-full transition-all duration-300"
                          style={{ backgroundColor: i <= strength.score ? strength.color : undefined }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium" style={{ color: strength.color || '#a1a1aa' }}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {reqItems.map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-1.5">
                        {passwordReqs[key] ? (
                          <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-content-tertiary shrink-0" />
                        )}
                        <span className={`text-xs ${passwordReqs[key] ? 'text-green-600' : 'text-content-tertiary'}`}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-new-password" className="block text-sm font-medium text-content-secondary mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirm-new-password"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                placeholder="Re-enter your password"
                className={`block w-full px-3 py-2.5 rounded-lg border text-sm text-content-primary bg-surface-primary placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-content-primary/20 focus:border-content-primary transition-colors ${
                  confirmPassword && password !== confirmPassword ? 'border-red-400' : 'border-border-strong'
                }`}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
              )}
            </div>

            <button
              id="reset-password-btn"
              type="submit"
              disabled={loading || !token}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg bg-content-primary text-surface-primary text-sm font-medium hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-content-primary transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-surface-primary/40 border-t-surface-primary rounded-full animate-spin" />
              ) : (
                'Set new password'
              )}
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

export default ResetPasswordPage;
