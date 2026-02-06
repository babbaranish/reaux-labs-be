import httpStatus from 'http-status';
import * as authService from './auth.service.js';
import { sendSuccess } from '../../shared/response.js';

export const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return sendSuccess(res, result, httpStatus.CREATED, 'Registration successful');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return sendSuccess(res, result, httpStatus.OK, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, user, httpStatus.OK, 'Profile updated');
  } catch (error) {
    next(error);
  }
};
