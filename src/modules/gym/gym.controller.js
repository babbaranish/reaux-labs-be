import httpStatus from 'http-status';
import * as gymService from './gym.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';

export const create = async (req, res, next) => {
  try {
    const gym = await gymService.createGym(req.body, req.user.id);
    return sendSuccess(res, gym, httpStatus.CREATED, 'Gym created successfully');
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { data, pagination } = await gymService.getGyms(req.query);
    return sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const gym = await gymService.getGymById(req.params.id);
    return sendSuccess(res, gym);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const gym = await gymService.updateGym(req.params.id, req.body);
    return sendSuccess(res, gym, httpStatus.OK, 'Gym updated successfully');
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await gymService.deleteGym(req.params.id);
    return sendSuccess(res, null, httpStatus.OK, 'Gym deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const assignAdmin = async (req, res, next) => {
  try {
    const user = await gymService.assignAdmin(req.params.id, req.body.userId);
    return sendSuccess(res, user, httpStatus.OK, 'Admin assigned successfully');
  } catch (error) {
    next(error);
  }
};
