import httpStatus from 'http-status';
import * as dietService from './diet.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  if (req.file?.path) {
    req.body.image = req.file.path;
  }
  const diet = await dietService.createDiet(req.body, req.user.id);
  return sendSuccess(res, diet, httpStatus.CREATED, 'Diet plan created successfully');
});

export const update = asyncHandler(async (req, res) => {
  if (req.file?.path) {
    req.body.image = req.file.path;
  }
  const diet = await dietService.updateDiet(req.params.id, req.body, req.user);
  return sendSuccess(res, diet, httpStatus.OK, 'Diet plan updated successfully');
});

export const list = asyncHandler(async (req, res) => {
  const userId = req.user?.id || null;
  const { data, pagination } = await dietService.getDiets(req.query, userId);
  return sendPaginated(res, data, pagination);
});

export const getById = asyncHandler(async (req, res) => {
  const userId = req.user?.id || null;
  const diet = await dietService.getDietById(req.params.id, userId);
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

export const getSuggested = asyncHandler(async (req, res) => {
  const { data, pagination, suggestion } =
    await dietService.getSuggestedDiets(req.user.id, req.query);
  return res.json({
    success: true,
    suggestion,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit),
    },
  });
});
