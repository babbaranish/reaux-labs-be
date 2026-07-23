import httpStatus from 'http-status';
import * as cycleService from './cycle.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  if (req.file?.path) {
    req.body.image = req.file.path;
  }
  const cycle = await cycleService.createCycle(req.body, req.user.id);
  return sendSuccess(res, cycle, httpStatus.CREATED, 'Cycle created successfully');
});

export const update = asyncHandler(async (req, res) => {
  if (req.file?.path) {
    req.body.image = req.file.path;
  }
  const cycle = await cycleService.updateCycle(req.params.id, req.body, req.user);
  return sendSuccess(res, cycle, httpStatus.OK, 'Cycle updated successfully');
});

export const remove = asyncHandler(async (req, res) => {
  const result = await cycleService.deleteCycle(req.params.id, req.user);
  return sendSuccess(res, result, httpStatus.OK, 'Cycle deleted successfully');
});

export const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await cycleService.getCycles(req.query, req.user || null);
  return sendPaginated(res, data, pagination);
});

export const getById = asyncHandler(async (req, res) => {
  const cycle = await cycleService.getCycleById(req.params.id, req.user?.id || null);
  return sendSuccess(res, cycle);
});

export const follow = asyncHandler(async (req, res) => {
  const cycle = await cycleService.followCycle(req.params.id, req.user.id);
  return sendSuccess(res, cycle, httpStatus.OK, 'Cycle follow toggled successfully');
});

export const like = asyncHandler(async (req, res) => {
  const cycle = await cycleService.likeCycle(req.params.id, req.user.id);
  return sendSuccess(res, cycle, httpStatus.OK, 'Cycle like toggled successfully');
});
