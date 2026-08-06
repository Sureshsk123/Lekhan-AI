import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  isAllowedEmail,
  checkPasswordRequirements,
  getPasswordStrength,
} from '../../utils/authValidation';

const EMAIL_HINT = 'Please enter a valid email address (e.g. user@example.com).';

const TARGET_LANGUAGES = [
  { code: 'tamil', flag: '🇮🇳', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'english', flag: '🇬🇧', name: 'English', nativeName: 'English' },
  { code: 'hindi', flag: '🇮🇳', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'telugu', flag: '🇮🇳', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'malayalam', flag: '🇮🇳', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'kannada', flag: '🇮🇳', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
];

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName:          '',
    email:             '',
    password:          '',
    confirmPassword:   '',
    preferredLanguage: 'tamil',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);

  const { signup } = useAuth();
  const navigate   = useNavigate();

  const passwordReqs = checkPasswordRequirements(formData.password);
  const strength     = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = 'Full name is required';

    if (!formData.email)
      newErrors.email = 'Email is required';
    else if (!isAllowedEmail(formData.email))
      newErrors.email = EMAIL_HINT;

    if (!formData.preferredLanguage)
      newErrors.preferredLanguage = 'Please select your preferred learning language';

    const allReqsMet = Object.values(passwordReqs).every(Boolean);
    if (!formData.password)
      newErrors.password = 'Password is required';
    else if (!allReqsMet)
      newErrors.password = 'Password does not meet the requirements below';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const res = await signup({
      fullName:          formData.fullName.trim(),
      email:             formData.email.trim().toLowerCase(),
      password:          formData.password,
      preferredLanguage: formData.preferredLanguage,
    });
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } else {
      setErrors({ form: res.message || 'Registration failed. Please try again.' });
    }
  };

  const reqItems = [
    { key: 'minLength', label: '8+ characters' },
    { key: 'uppercase', label: 'Uppercase letter' },
    { key: 'lowercase', label: 'Lowercase letter' },
    { key: 'number',    label: 'Number' },
  ];

  /* ── Success state ── */
  if (success) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-content-primary mb-1">Account Created!</h2>
          <p className="text-sm text-content-secondary">Redirecting to your dashboard…</p>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-content-primary text-surface-primary rounded-lg font-bold text-sm mb-4">
          LS
        </div>
        <h1 className="text-2xl font-semibold text-content-primary">Create your account</h1>
        <p className="mt-1 text-sm text-content-secondary">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-content-primary underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </div>

      {/* Card */}
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-surface-primary border border-border-light rounded-xl shadow-sm px-8 py-8">

          {errors.form && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-content-secondary mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`block w-full px-3 py-2.5 rounded-lg border text-sm text-content-primary bg-surface-primary placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-content-primary/20 focus:border-content-primary transition-colors ${
                  errors.fullName ? 'border-red-400' : 'border-border-strong'
                }`}
              />
              {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-content-secondary mb-1.5">
                Email address
              </label>
              <input
                id="reg-email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`block w-full px-3 py-2.5 rounded-lg border text-sm text-content-primary bg-surface-primary placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-content-primary/20 focus:border-content-primary transition-colors ${
                  errors.email ? 'border-red-400' : 'border-border-strong'
                }`}
              />
              {errors.email
                ? <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                : formData.email && !isAllowedEmail(formData.email) && (
                    <p className="mt-1 text-xs text-amber-600">{EMAIL_HINT}</p>
                  )
              }
            </div>

            {/* Preferred Learning Language */}
            <div>
              <label className="block text-sm font-medium text-content-secondary mb-1.5">
                Preferred Learning Language <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TARGET_LANGUAGES.map((lang) => {
                  const isSelected = formData.preferredLanguage === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, preferredLanguage: lang.code }));
                        if (errors.preferredLanguage) setErrors(prev => ({ ...prev, preferredLanguage: '' }));
                      }}
                      className={`p-2.5 rounded-lg border flex flex-col items-center justify-center text-xs font-medium transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold ring-2 ring-blue-500/20'
                          : 'border-border-strong bg-surface-primary text-content-primary hover:border-blue-400'
                      }`}
                    >
                      <span className="text-base mb-0.5">{lang.flag}</span>
                      <span>{lang.name}</span>
                      <span className="text-[10px] opacity-75 font-normal">{lang.nativeName}</span>
                    </button>
                  );
                })}
              </div>
              {errors.preferredLanguage && (
                <p className="mt-1 text-xs text-red-600">{errors.preferredLanguage}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-content-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className={`block w-full px-3 py-2.5 pr-10 rounded-lg border text-sm text-content-primary bg-surface-primary placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-content-primary/20 focus:border-content-primary transition-colors ${
                    errors.password ? 'border-red-400' : 'border-border-strong'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-secondary"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}

              {/* Live strength meter */}
              {formData.password && (
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
                    <span className="text-xs font-medium w-16 text-right" style={{ color: strength.color || '#a1a1aa' }}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {reqItems.map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-1.5">
                        {passwordReqs[key]
                          ? <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          : <X     className="w-3.5 h-3.5 text-content-tertiary shrink-0" />
                        }
                        <span className={`text-xs ${passwordReqs[key] ? 'text-green-600 dark:text-green-400' : 'text-content-tertiary'}`}>
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-content-secondary mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`block w-full px-3 py-2.5 pr-10 rounded-lg border text-sm text-content-primary bg-surface-primary placeholder-content-tertiary focus:outline-none focus:ring-2 focus:ring-content-primary/20 focus:border-content-primary transition-colors ${
                    errors.confirmPassword ? 'border-red-400' : 'border-border-strong'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-content-tertiary hover:text-content-secondary"
                  aria-label="Toggle confirm visibility"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button
              id="create-account-btn"
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg bg-content-primary text-surface-primary text-sm font-medium hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-content-primary transition-colors disabled:opacity-50"
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-surface-primary/40 border-t-surface-primary rounded-full animate-spin" />
                : 'Create account'
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

export default RegisterPage;
