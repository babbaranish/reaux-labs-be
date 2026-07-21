import httpStatus from 'http-status';
import slugify from 'slugify';
import { CyclePlan } from './cycle.model.js';
import { User } from '../user/user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { toggleArrayField, addIsLiked } from '../../shared/socialToggle.js';
import { findByIdOrFail, updateByIdOrFail } from '../../shared/crudOperations.js';
import { createNotification } from '../../shared/pushNotification.js';

export const createCycle = async (data, userId) => {
  const slug = slugify(data.title, { lower: true, strict: true });

  const existing = await CyclePlan.findOne({ slug });
  if (existing) {
    throw new AppError('A cycle with this title already exists', httpStatus.CONFLICT);
  }

  const cycle = await CyclePlan.create({ ...data, slug, createdBy: userId });
  return cycle;
};

export const updateCycle = async (id, data) => {
  return updateByIdOrFail(CyclePlan, id, data);
};

export const deleteCycle = async (id) => {
  const doc = await CyclePlan.findByIdAndDelete(id);
  if (!doc) {
    throw new AppError('CyclePlan not found', httpStatus.NOT_FOUND);
  }
  return { message: 'Cycle deleted successfully' };
};

export const getCycles = async (query, user = null) => {
  const isAdmin = user && ['admin', 'superadmin'].includes(user.role);

  const filter = {};
  // Only admins can view unpublished cycles (and only when they ask for them).
  if (!(query.includeUnpublished === 'true' && isAdmin)) {
    filter.isPublished = true;
  }
  if (query.category) filter.category = query.category;
  if (query.level) filter.level = query.level;
  if (query.type) filter.type = query.type;
  if (query.tag) filter.tags = { $in: [query.tag] };

  const result = await paginate(CyclePlan, filter, {
    page: query.page,
    limit: query.limit,
    sort: query.sort || { createdAt: -1 },
    populate: { path: 'createdBy', select: 'name avatar role' },
    select: '-likes -followers',
  });

  const userId = user?.id || null;
  if (userId) {
    result.data = await Promise.all([
      addIsLiked(CyclePlan, result.data, userId, 'likes'),
      addIsLiked(CyclePlan, result.data, userId, 'followers'),
    ]).then(([withLikes, withFollowers]) =>
      withLikes.map((cycle, i) => ({
        ...cycle,
        isFollowed: withFollowers[i].isLiked,
      }))
    );
  }

  return result;
};

export const getCycleById = async (id, userId = null) => {
  const cycle = await findByIdOrFail(CyclePlan, id, {
    populate: { path: 'createdBy', select: 'name avatar role' },
    select: '-likes -followers',
  });

  if (userId) {
    const [withLikes] = await addIsLiked(CyclePlan, [cycle], userId, 'likes');
    const [withFollowers] = await addIsLiked(CyclePlan, [cycle], userId, 'followers');
    return {
      ...withLikes,
      isFollowed: withFollowers.isLiked,
    };
  }

  return cycle;
};

export const followCycle = async (cycleId, userId) => {
  const result = await toggleArrayField(CyclePlan, cycleId, userId, 'followers', {
    countField: 'followersCount',
    selectExclude: '-likes -followers',
  });

  if (result.isLiked && result.createdBy && result.createdBy.toString() !== userId.toString()) {
    User.findById(userId).select('name').lean().then((user) => {
      if (user) {
        createNotification({
          userId: result.createdBy,
          title: 'New Follower',
          message: `${user.name} followed your cycle "${result.title}"`,
          type: 'diet',
          metadata: { cycleId },
        }).catch(() => {});
      }
    });
  }

  return {
    ...result,
    isFollowed: result.isLiked,
  };
};

export const likeCycle = async (cycleId, userId) => {
  const result = await toggleArrayField(CyclePlan, cycleId, userId, 'likes', {
    countField: 'likesCount',
    selectExclude: '-likes -followers',
  });

  if (result.isLiked && result.createdBy && result.createdBy.toString() !== userId.toString()) {
    User.findById(userId).select('name').lean().then((user) => {
      if (user) {
        createNotification({
          userId: result.createdBy,
          title: 'New Like',
          message: `${user.name} liked your cycle "${result.title}"`,
          type: 'diet',
          metadata: { cycleId },
        }).catch(() => {});
      }
    });
  }

  return result;
};
