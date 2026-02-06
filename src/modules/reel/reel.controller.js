import httpStatus from 'http-status';
import * as reelService from './reel.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';

export const create = async (req, res, next) => {
  try {
    const reel = await reelService.createReel(req.body, req.user.id);
    return sendSuccess(res, reel, httpStatus.CREATED, 'Reel created');
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { data, pagination } = await reelService.getReels(req.query);
    return sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
};

export const like = async (req, res, next) => {
  try {
    const reel = await reelService.likeReel(req.params.id, req.user.id);
    return sendSuccess(res, reel, httpStatus.OK, 'Like toggled');
  } catch (error) {
    next(error);
  }
};
