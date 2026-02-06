import httpStatus from 'http-status';
import * as dietService from './diet.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';

export const create = async (req, res, next) => {
  try {
    const diet = await dietService.createDiet(req.body, req.user.id);
    return sendSuccess(res, diet, httpStatus.CREATED, 'Diet plan created successfully');
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const diet = await dietService.updateDiet(req.params.id, req.body);
    return sendSuccess(res, diet, httpStatus.OK, 'Diet plan updated successfully');
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { data, pagination } = await dietService.getDiets(req.query);
    return sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const diet = await dietService.getDietById(req.params.id);
    return sendSuccess(res, diet);
  } catch (error) {
    next(error);
  }
};

export const follow = async (req, res, next) => {
  try {
    const diet = await dietService.followDiet(req.params.id, req.user.id);
    return sendSuccess(res, diet, httpStatus.OK, 'Diet follow toggled successfully');
  } catch (error) {
    next(error);
  }
};

export const like = async (req, res, next) => {
  try {
    const diet = await dietService.likeDiet(req.params.id, req.user.id);
    return sendSuccess(res, diet, httpStatus.OK, 'Diet like toggled successfully');
  } catch (error) {
    next(error);
  }
};
