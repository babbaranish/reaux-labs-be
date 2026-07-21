import httpStatus from 'http-status';
import * as gymService from './gym.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.files?.images?.length) {
    data.images = req.files.images.map((f) => f.path);
  }
  if (req.files?.logo?.length) {
    data.logo = req.files.logo[0].path;
  }
  const gym = await gymService.createGym(data, req.user.id);
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
  const data = { ...req.body };
  if (req.files?.images?.length) {
    data.images = req.files.images.map((f) => f.path);
  }
  if (req.files?.logo?.length) {
    data.logo = req.files.logo[0].path;
  }
  const gym = await gymService.updateGym(req.params.id, data);
  return sendSuccess(res, gym, httpStatus.OK, 'Gym updated successfully');
});

export const remove = asyncHandler(async (req, res) => {
  await gymService.deleteGym(req.params.id);
  return sendSuccess(res, null, httpStatus.OK, 'Gym deleted successfully');
});

export const createCandidate = asyncHandler(async (req, res) => {
  if (req.file?.path) {
    req.body.avatar = req.file.path;
  }
  const membership = await gymService.createCandidate(req.body, req.user);
  return sendSuccess(res, membership, httpStatus.CREATED, 'Candidate added successfully');
});

export const removeCandidate = asyncHandler(async (req, res) => {
  const result = await gymService.removeCandidate(req.params.id, req.user);
  return sendSuccess(res, result, httpStatus.OK, 'Candidate removed');
});

export const assignAdmin = asyncHandler(async (req, res) => {
  const user = await gymService.assignAdmin(req.params.id, req.body.userId);
  return sendSuccess(res, user, httpStatus.OK, 'Admin assigned successfully');
});
