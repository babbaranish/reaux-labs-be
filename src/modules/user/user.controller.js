import httpStatus from 'http-status';
import * as userService from './user.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body, req.user);
  return sendSuccess(res, user, httpStatus.CREATED, 'User created successfully');
});

export const getUsers = asyncHandler(async (req, res) => {
  const { data, pagination } = await userService.getUsers(req.query, req.user);
  return sendPaginated(res, data, pagination);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return sendSuccess(res, user);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body, req.user);
  return sendSuccess(res, user, httpStatus.OK, 'User updated successfully');
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role);
  return sendSuccess(res, user, httpStatus.OK, 'User role updated');
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.updateUserStatus(req.params.id, req.body.status);
  return sendSuccess(res, user, httpStatus.OK, 'User status updated');
});

export const getTodayBirthdays = asyncHandler(async (req, res) => {
  const users = await userService.getTodayBirthdays(req.user);
  return sendSuccess(res, users);
});

export const getUpcomingBirthdays = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 7;
  const users = await userService.getUpcomingBirthdays(req.user, days);
  return sendSuccess(res, users);
});
