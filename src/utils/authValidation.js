// Standard email + password validation utilities for LangSphere AI V1.0

export const VALID_EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export function isAllowedEmail(email) {
  return VALID_EMAIL_REGEX.test(email.trim());
}

/** @deprecated kept for backward compatibility */
export const isSaveeathaEmail = isAllowedEmail;

/**
 * Returns an object with boolean flags for each password requirement.
 * Min 8 chars, uppercase, lowercase, number.
 */
export function checkPasswordRequirements(password) {
  return {
    minLength: password.length >= 8,
    maxLength: password.length <= 64,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
}

/**
 * Returns a score from 0–5 based on how many requirements are met.
 */
export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };

  const req = checkPasswordRequirements(password);
  const metCount = Object.values(req).filter(Boolean).length;

  if (metCount <= 1) return { score: 1, label: 'Weak',      color: '#ef4444' };
  if (metCount === 2) return { score: 2, label: 'Fair',      color: '#f97316' };
  if (metCount === 3) return { score: 3, label: 'Good',      color: '#eab308' };
  if (metCount === 4) return { score: 4, label: 'Strong',    color: '#22c55e' };
  if (metCount >= 5)  return { score: 5, label: 'Excellent', color: '#10b981' };

  return { score: 0, label: '', color: '' };
}
