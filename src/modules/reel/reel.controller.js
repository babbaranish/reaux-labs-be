import httpStatus from 'http-status';
import * as reelService from './reel.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const data = {
    caption: req.body.caption,
    videoUrl: req.file?.path || req.body.videoUrl,
  };
  if (req.body.linkedProduct) {
    data.linkedProduct = req.body.linkedProduct;
  }
  const reel = await reelService.createReel(data, req.user.id);
  return sendSuccess(res, reel, httpStatus.CREATED, 'Reel created');
});

export const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await reelService.getReels(req.query, req.user?.id);
  return sendPaginated(res, data, pagination);
});

export const getById = asyncHandler(async (req, res) => {
  const reel = await reelService.getReelById(req.params.id, req.user?.id);
  return sendSuccess(res, reel, httpStatus.OK);
});

export const like = asyncHandler(async (req, res) => {
  const reel = await reelService.likeReel(req.params.id, req.user.id);
  return sendSuccess(res, reel, httpStatus.OK, 'Like toggled');
});
