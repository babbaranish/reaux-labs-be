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
  const alreadyLiked = await Reel.exists({ _id: reelId, likes: userId });

  if (!alreadyLiked) {
    const reel = await Reel.findOneAndUpdate(
      { _id: reelId, likes: { $ne: userId } },
      { $addToSet: { likes: userId }, $inc: { likesCount: 1 } },
      { new: true }
    ).select('-likes').lean();

    if (!reel) {
      throw new AppError('Reel not found', httpStatus.NOT_FOUND);
    }
    return reel;
  }

  const reel = await Reel.findOneAndUpdate(
    { _id: reelId, likes: userId },
    { $pull: { likes: userId }, $inc: { likesCount: -1 } },
    { new: true }
  ).select('-likes').lean();

  return reel;
};
