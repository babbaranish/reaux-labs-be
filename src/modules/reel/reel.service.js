import httpStatus from 'http-status';
import { Reel } from './reel.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';

export const createReel = async (data, userId) => {
  const reel = await Reel.create({
    ...data,
    author: userId,
  });
  return reel;
};

export const getReels = async (query) => {
  const result = await paginate(Reel, {}, {
    page: query.page,
    limit: query.limit,
    populate: { path: 'author', select: 'name avatar' },
    select: '-likes',
  });

  return result;
};

export const getReelById = async (reelId) => {
  const reel = await Reel.findById(reelId)
    .populate('author', 'name avatar')
    .populate('linkedProduct', 'name price images');

  if (!reel) {
    throw new AppError('Reel not found', httpStatus.NOT_FOUND);
  }

  return reel;
};

export const likeReel = async (reelId, userId) => {
  const reel = await Reel.findById(reelId);
  if (!reel) {
    throw new AppError('Reel not found', httpStatus.NOT_FOUND);
  }

  const likeIndex = reel.likes.indexOf(userId);

  if (likeIndex === -1) {
    reel.likes.push(userId);
    reel.likesCount = reel.likes.length;
  } else {
    reel.likes.splice(likeIndex, 1);
    reel.likesCount = reel.likes.length;
  }

  await reel.save();
  return reel;
};
