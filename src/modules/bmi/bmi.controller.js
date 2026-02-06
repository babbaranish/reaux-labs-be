import httpStatus from 'http-status';
import * as bmiService from './bmi.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';

export const record = async (req, res, next) => {
  try {
    const bmiRecord = await bmiService.recordBmi(req.user.id, req.body);
    return sendSuccess(res, bmiRecord, httpStatus.CREATED, 'BMI recorded successfully');
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const { data, pagination } = await bmiService.getHistory(req.user.id, req.query);
    return sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
};

export const getLatest = async (req, res, next) => {
  try {
    const bmiRecord = await bmiService.getLatest(req.user.id);
    return sendSuccess(res, bmiRecord);
  } catch (error) {
    next(error);
  }
};
