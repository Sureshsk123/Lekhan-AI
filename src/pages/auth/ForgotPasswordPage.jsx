import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { isAllowedEmail } from '../../utils/authValidation';
import apiClient from '../../services/apiClient';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    if (!email) return 'Email is required';
    if (!isAllowedEmail(email))
      return 'Please use a valid Gmail or Saveetha University email address.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setApiError('');

    const err = validate();
    if (err) {
      setEmailError(err);
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/v1/auth/forgot-password', { email: email.toLowerCase() });
      setSubmitted(true);
    } catch (error) {
      setApiError(
        error?.response?.data?.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-content-primary text-surface-primary rounded-lg font-bold text-sm mb-4">
          LS
        </div>
        <h1 className="text-2xl font-semibold text-content-primary">Reset your password</h1>
        <p className="mt-1 text-sm text-content-secondary">
          Remember it?{' '}
          <Link to="/login" className="font-medium text-content-primary underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>

      {/* Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-surface-primary border border-border-light rounded-xl shadow-sm px-8 py-8">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-base font-semibold text-content-primary mb-2">Check your email</h3>
              <p className="text-sm text-content-secondary mb-4">
                If <span className="font-medium text-content-primary">{email}</span> is registered,
                we&apos;ve sent a password reset link valid for <span className="font-medium">15 minutes</span>.
              </p>
              <button
                onClick={() => { setSubmitted(false); setEmail(''); }}
                className="text-sm text-content-secondary hover:text-content-primary underline underline-offset-2"
              >
                Send again to a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {apiError && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {apiError}
                </div>
              )}

              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-content-secondary mb-1.5">
                  Saveetha University Email
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="you@example.com"
                  className={`block w-full px-3 py-2.5 rounded-lg border text-sm text-content-primary bg-surface-primary placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-content-primary/20 focus:border-content-primary transition-colors ${
                    emailError ? 'border-red-400' : 'border-border-strong'
                  }`}
                />
                {emailError && (
                  <p className="mt-1 text-xs text-red-600">{emailError}</p>
                )}
                {email && !isAllowedEmail(email) && !emailError && (
                  <p className="mt-1 text-xs text-amber-600">
                    Please enter a valid email address.
                  </p>
                )}
              </div>

              <button
                id="reset-link-btn"
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg bg-content-primary text-surface-primary text-sm font-medium hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-content-primary transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-surface-primary/40 border-t-surface-primary rounded-full animate-spin" />
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-content-tertiary">
          &copy; 2026 LangSphere AI. Developed at SIMATS Engineering.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
