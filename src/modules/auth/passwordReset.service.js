import crypto from 'crypto';
import httpStatus from 'http-status';
import { User } from '../user/user.model.js';
import { PasswordReset } from './passwordReset.model.js';
import { AppError } from '../../shared/appError.js';
import { sendEmail } from '../../shared/emailSender.js';
import { passwordResetEmail } from '../../shared/emailTemplates.js';
import env from '../../config/env.js';

export const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  // Don't reveal whether the email exists
  if (!user) {
    return { message: 'If that email exists, a reset link has been sent' };
  }

  // Invalidate previous tokens
  await PasswordReset.updateMany({ userId: user._id, used: false }, { used: true });

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour

  await PasswordReset.create({ userId: user._id, token, expiresAt });

  // Deep link that opens the app directly on the reset screen (see env.PASSWORD_RESET_URL).
  const sep = env.PASSWORD_RESET_URL.includes('?') ? '&' : '?';
  const resetUrl = `${env.PASSWORD_RESET_URL}${sep}token=${token}`;

  sendEmail({
    to: email,
    subject: 'Reset Your REAUX Labs Password',
    html: passwordResetEmail(user.name, resetUrl),
  }).catch((err) => console.error('Password reset email failed:', err.message));

  return { message: 'If that email exists, a reset link has been sent' };
};

export const resetPassword = async (token, newPassword) => {
  const resetRecord = await PasswordReset.findOne({
    token,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!resetRecord) {
    throw new AppError('Invalid or expired reset token', httpStatus.BAD_REQUEST);
  }

  const user = await User.findById(resetRecord.userId);
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  user.password = newPassword;
  await user.save();

  resetRecord.used = true;
  await resetRecord.save();

  return { message: 'Password reset successful' };
};
