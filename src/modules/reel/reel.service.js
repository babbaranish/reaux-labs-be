import httpStatus from 'http-status';
import { Reel } from './reel.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { toggleArrayField, addIsLiked } from '../../shared/socialToggle.js';

export const createReel = async (data, userId) => {
  return Reel.create({ ...data, author: userId });
};

export const getReels = async (query, userId) => {
  const result = await paginate(Reel, {}, {
    page: query.page,
    limit: query.limit,
    populate: { path: 'author', select: 'name avatar' },
    select: '-likes',
  });

  result.data = await addIsLiked(Reel, result.data, userId);
  return result;
};

export const getReelById = async (reelId, userId) => {
  const reel = await Reel.findById(reelId)
    .populate('author', 'name avatar')
    .populate('linkedProduct', 'name price images')
    .select('-likes')
    .lean();

  if (!reel) {
    throw new AppError('Reel not found', httpStatus.NOT_FOUND);
  }

  const [enriched] = await addIsLiked(Reel, [reel], userId);
  return enriched;
};

export const likeReel = async (reelId, userId) => {
  return toggleArrayField(Reel, reelId, userId, 'likes', { countField: 'likesCount' });
};
