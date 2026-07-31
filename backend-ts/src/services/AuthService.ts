import { prisma } from '../server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_that_needs_to_be_long_in_prod';
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || 'super_secret_refresh_key_that_needs_to_be_long';

// ==========================================
// VALIDATION HELPERS
// ==========================================

// Accepts any standard email address
const VALID_EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const PASSWORD_POLICY = {
  minLength: 8,
  maxLength: 64,
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
};

export function validateAllowedEmail(email: string): void {
  if (!VALID_EMAIL_REGEX.test(email.trim())) {
    throw new Error('Please enter a valid email address.');
  }
}

export function validatePassword(password: string): void {
  if (password.length < PASSWORD_POLICY.minLength) {
    throw new Error(`Password must be at least ${PASSWORD_POLICY.minLength} characters long`);
  }
  if (password.length > PASSWORD_POLICY.maxLength) {
    throw new Error(`Password must be no more than ${PASSWORD_POLICY.maxLength} characters long`);
  }
  if (!PASSWORD_POLICY.uppercase.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!PASSWORD_POLICY.lowercase.test(password)) {
    throw new Error('Password must contain at least one lowercase letter');
  }
  if (!PASSWORD_POLICY.number.test(password)) {
    throw new Error('Password must contain at least one number');
  }
}

// ==========================================
// AUTH SERVICE
// ==========================================

export class AuthService {
  async register(email: string, password: string, fullName: string) {
    // Validate email domain
    validateAllowedEmail(email);

    // Validate password policy
    validatePassword(password);

    // Check if already registered
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) throw new Error('An account with this email already exists');

    // Ensure student role exists
    let studentRole = await prisma.role.findFirst({ where: { name: 'student' } });
    if (!studentRole) {
      studentRole = await prisma.role.create({ data: { name: 'student' } });
    }

    // Split fullName into firstName / lastName
    const nameParts = fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        roleId: studentRole.id,
      }
    });

    const accessToken = jwt.sign(
      { id: user.id, role: studentRole.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, jti: crypto.randomUUID() },
      JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    // Store refresh token in Session table
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: `${firstName} ${lastName}`.trim(),
        firstName: user.firstName,
        lastName: user.lastName,
        xp: user.xp,
        coins: user.coins,
        role: studentRole.name
      },
      token: accessToken,
      refreshToken
    };
  }

  async login(email: string, password: string) {
    // Validate email domain (server-side)
    validateAllowedEmail(email);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true }
    });

    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password');
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new Error('Invalid email or password');
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role.name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.id, jti: crypto.randomUUID() },
      JWT_REFRESH_SECRET,
      { expiresIn: '30d' }
    );

    // Upsert session
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        firstName: user.firstName,
        lastName: user.lastName,
        xp: user.xp,
        coins: user.coins,
        role: user.role.name
      },
      token: accessToken,
      refreshToken
    };
  }

  async forgotPassword(email: string): Promise<string> {
    validateAllowedEmail(email);

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    // Return silently whether user exists or not for security
    if (!user) return 'If that email exists, a reset link has been sent.';

    // Generate a secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store hashed token in the notifications table (re-using existing table)
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'PASSWORD_RESET',
        title: resetToken,          // store raw token as title (will validate on reset)
        message: tokenExpiry.toISOString(),
      }
    });

    // In production, you'd email the token. For now, return it in the response.
    // (Frontend can display this to the user for demo purposes)
    return resetToken;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    validatePassword(newPassword);

    // Find notification with this token
    const notification = await prisma.notification.findFirst({
      where: { title: token, type: 'PASSWORD_RESET' },
      include: { user: true }
    });

    if (!notification) {
      throw new Error('Invalid or expired reset token');
    }

    const tokenExpiry = new Date(notification.message);
    if (new Date() > tokenExpiry) {
      await prisma.notification.delete({ where: { id: notification.id } });
      throw new Error('Reset token has expired. Please request a new one.');
    }

    // Update password
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: notification.userId },
      data: { passwordHash }
    });

    // Invalidate the token
    await prisma.notification.delete({ where: { id: notification.id } });
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    });
    if (!user) throw new Error('User not found');

    return {
      id: user.id,
      email: user.email,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      firstName: user.firstName,
      lastName: user.lastName,
      xp: user.xp,
      coins: user.coins,
      streak: user.streak,
      role: user.role.name,
      createdAt: user.createdAt,
    };
  }

  async logout(userId: string, refreshToken: string): Promise<void> {
    // Remove the specific session
    await prisma.session.deleteMany({
      where: { userId, refreshToken }
    }).catch(() => {}); // ignore if not found
  }
}

export const authService = new AuthService();
