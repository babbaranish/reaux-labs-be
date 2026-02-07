import httpStatus from 'http-status';
import { Reel } from './reel.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { toggleArrayField } from '../../shared/socialToggle.js';

export const createReel = async (data, userId) => {
  return Reel.create({ ...data, author: userId });
};

export const getReels = async (query) => {
  return paginate(Reel, {}, {
    page: query.page,
    limit: query.limit,
    populate: { path: 'author', select: 'name avatar' },
    select: '-likes',
  });
};

export const getReelById = async (reelId) => {
  const reel = await Reel.findById(reelId)
    .populate('author', 'name avatar')
    .populate('linkedProduct', 'name price images')
    .select('-likes')
    .lean();

  if (!reel) {
    throw new AppError('Reel not found', httpStatus.NOT_FOUND);
  }

  return reel;
};

export const likeReel = async (reelId, userId) => {
  return toggleArrayField(Reel, reelId, userId, 'likes', { countField: 'likesCount' });
};
