import httpStatus from 'http-status';
import * as dietService from './diet.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const diet = await dietService.createDiet(req.body, req.user.id);
  return sendSuccess(res, diet, httpStatus.CREATED, 'Diet plan created successfully');
});

export const update = asyncHandler(async (req, res) => {
  const diet = await dietService.updateDiet(req.params.id, req.body);
  return sendSuccess(res, diet, httpStatus.OK, 'Diet plan updated successfully');
});

export const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await dietService.getDiets(req.query);
  return sendPaginated(res, data, pagination);
});

export const getById = asyncHandler(async (req, res) => {
  const diet = await dietService.getDietById(req.params.id);
  return sendSuccess(res, diet);
});

export const follow = asyncHandler(async (req, res) => {
  const diet = await dietService.followDiet(req.params.id, req.user.id);
  return sendSuccess(res, diet, httpStatus.OK, 'Diet follow toggled successfully');
});

export const like = asyncHandler(async (req, res) => {
  const diet = await dietService.likeDiet(req.params.id, req.user.id);
  return sendSuccess(res, diet, httpStatus.OK, 'Diet like toggled successfully');
});
