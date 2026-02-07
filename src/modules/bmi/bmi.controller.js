import httpStatus from 'http-status';
import * as bmiService from './bmi.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const record = asyncHandler(async (req, res) => {
  const bmiRecord = await bmiService.recordBmi(req.user.id, req.body);
  return sendSuccess(res, bmiRecord, httpStatus.CREATED, 'BMI recorded successfully');
});

export const getHistory = asyncHandler(async (req, res) => {
  const { data, pagination } = await bmiService.getHistory(req.user.id, req.query);
  return sendPaginated(res, data, pagination);
});

export const getLatest = asyncHandler(async (req, res) => {
  const bmiRecord = await bmiService.getLatest(req.user.id);
  return sendSuccess(res, bmiRecord);
});
