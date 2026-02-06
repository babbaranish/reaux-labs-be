import httpStatus from 'http-status';
import * as analyticsService from './analytics.service.js';
import { sendSuccess } from '../../shared/response.js';

export const getStats = async (req, res, next) => {
  try {
    const stats = await analyticsService.getStats();
    return sendSuccess(res, stats);
  } catch (error) {
    next(error);
  }
};

export const getSalesReport = async (req, res, next) => {
  try {
    const report = await analyticsService.getSalesReport();
    return sendSuccess(res, report);
  } catch (error) {
    next(error);
  }
};
