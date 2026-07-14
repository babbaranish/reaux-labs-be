import httpStatus from 'http-status';
import { isValidObjectId } from 'mongoose';
import * as reelService from './reel.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const data = {
    caption: req.body.caption,
    videoUrl: req.files?.video?.[0]?.path || req.body.videoUrl,
    thumbnailUrl: req.files?.thumbnail?.[0]?.path || req.body.thumbnailUrl,
  };

  if (req.body.category) {
    data.category = String(req.body.category).toLowerCase();
  }

  // linkedProduct is a Product ref; older clients send a shop URL here, so route
  // anything that isn't an ObjectId to productLink instead of failing the cast.
  const link = req.body.productLink || req.body.linkedProduct;
  if (link) {
    if (isValidObjectId(link)) {
      data.linkedProduct = link;
    } else {
      data.productLink = link;
    }
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

export const comment = asyncHandler(async (req, res) => {
  const result = await reelService.addComment(req.params.id, req.user.id, req.body.content);
  return sendSuccess(res, result, httpStatus.CREATED, 'Comment added');
});

export const listComments = asyncHandler(async (req, res) => {
  const { data, pagination } = await reelService.getComments(req.params.id, req.query);
  return sendPaginated(res, data, pagination);
});
