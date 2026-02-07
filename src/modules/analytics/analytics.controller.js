import httpStatus from 'http-status';
import * as analyticsService from './analytics.service.js';
import { sendSuccess } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getStats();
  return sendSuccess(res, stats);
});

export const getSalesReport = asyncHandler(async (req, res) => {
  const report = await analyticsService.getSalesReport();
  return sendSuccess(res, report);
});
