import httpStatus from 'http-status';
import * as userService from './user.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';

export const getUsers = async (req, res, next) => {
  try {
    const { data, pagination } = await userService.getUsers(req.query);
    return sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await userService.updateUserRole(req.params.id, req.body.role);
    return sendSuccess(res, user, httpStatus.OK, 'User role updated');
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await userService.updateUserStatus(req.params.id, req.body.status);
    return sendSuccess(res, user, httpStatus.OK, 'User status updated');
  } catch (error) {
    next(error);
  }
};
