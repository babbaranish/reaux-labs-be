import httpStatus from 'http-status';
import { Reel } from './reel.model.js';
import { ReelComment } from './reelComment.model.js';
import { User } from '../user/user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { toggleArrayField, addIsLiked } from '../../shared/socialToggle.js';
import { createNotification } from '../../shared/pushNotification.js';

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
  const result = await toggleArrayField(Reel, reelId, userId, 'likes', { countField: 'likesCount' });

  if (result.isLiked && result.author.toString() !== userId.toString()) {
    User.findById(userId).select('name').lean().then((user) => {
      if (user) {
        createNotification({
          userId: result.author,
          title: 'New Like',
          message: `${user.name} liked your reel`,
          type: 'community',
          metadata: { reelId },
        }).catch(() => {});
      }
    });
  }

  return result;
};

export const addComment = async (reelId, userId, content) => {
  const reel = await Reel.findById(reelId).select('author').lean();
  if (!reel) {
    throw new AppError('Reel not found', httpStatus.NOT_FOUND);
  }

  const [comment] = await Promise.all([
    ReelComment.create({ reelId, author: userId, content }),
    Reel.findByIdAndUpdate(reelId, { $inc: { commentsCount: 1 } }),
  ]);

  if (reel.author.toString() !== userId.toString()) {
    User.findById(userId).select('name').lean().then((user) => {
      if (user) {
        createNotification({
          userId: reel.author,
          title: 'New Comment',
          message: `${user.name} commented on your reel`,
          type: 'community',
          metadata: { reelId, commentId: comment._id },
        }).catch(() => {});
      }
    });
  }

  return comment.populate('author', 'name avatar');
};

export const getComments = async (reelId, query) => {
  const reel = await Reel.findById(reelId).select('_id').lean();
  if (!reel) {
    throw new AppError('Reel not found', httpStatus.NOT_FOUND);
  }
  return paginate(ReelComment, { reelId }, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
    populate: { path: 'author', select: 'name avatar' },
  });
};
