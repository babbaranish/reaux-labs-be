import httpStatus from 'http-status';
import * as userService from './user.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  return sendSuccess(res, user, httpStatus.CREATED, 'User created successfully');
});

export const getUsers = asyncHandler(async (req, res) => {
  const { data, pagination } = await userService.getUsers(req.query);
  return sendPaginated(res, data, pagination);
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return sendSuccess(res, user);
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role);
  return sendSuccess(res, user, httpStatus.OK, 'User role updated');
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.updateUserStatus(req.params.id, req.body.status);
  return sendSuccess(res, user, httpStatus.OK, 'User status updated');
});
