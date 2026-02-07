import httpStatus from 'http-status';
import * as gymService from './gym.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const gym = await gymService.createGym(req.body, req.user.id);
  return sendSuccess(res, gym, httpStatus.CREATED, 'Gym created successfully');
});

export const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await gymService.getGyms(req.query);
  return sendPaginated(res, data, pagination);
});

export const getById = asyncHandler(async (req, res) => {
  const gym = await gymService.getGymById(req.params.id);
  return sendSuccess(res, gym);
});

export const update = asyncHandler(async (req, res) => {
  const gym = await gymService.updateGym(req.params.id, req.body);
  return sendSuccess(res, gym, httpStatus.OK, 'Gym updated successfully');
});

export const remove = asyncHandler(async (req, res) => {
  await gymService.deleteGym(req.params.id);
  return sendSuccess(res, null, httpStatus.OK, 'Gym deleted successfully');
});

export const assignAdmin = asyncHandler(async (req, res) => {
  const user = await gymService.assignAdmin(req.params.id, req.body.userId);
  return sendSuccess(res, user, httpStatus.OK, 'Admin assigned successfully');
});
