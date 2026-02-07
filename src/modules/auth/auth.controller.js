import httpStatus from 'http-status';
import * as authService from './auth.service.js';
import * as passwordResetService from './passwordReset.service.js';
import { sendSuccess } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return sendSuccess(res, result, httpStatus.CREATED, 'Registration successful');
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return sendSuccess(res, result, httpStatus.OK, 'Login successful');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);
  return sendSuccess(res, user);
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);
  return sendSuccess(res, user, httpStatus.OK, 'Profile updated');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await passwordResetService.requestPasswordReset(req.body.email);
  return sendSuccess(res, result, httpStatus.OK, result.message);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await passwordResetService.resetPassword(req.body.token, req.body.password);
  return sendSuccess(res, result, httpStatus.OK, result.message);
});
