import httpStatus from 'http-status';
import { AppError } from './appError.js';

/**
 * Toggle a user in an array field (like/follow/bookmark) with atomic operations.
 * Uses a single findOneAndUpdate per attempt to avoid race conditions.
 * Returns the resource with an `isLiked` (or `isFollowed`) boolean.
 * @param {Model} model - Mongoose model
 * @param {string} resourceId - Document ID
 * @param {string} userId - User ID to toggle
 * @param {string} field - Array field name (e.g. 'likes', 'followers')
 * @param {object} options
 * @param {string} [options.countField] - Counter field to increment/decrement (e.g. 'likesCount')
 * @param {string} [options.selectExclude] - Fields to exclude from response
 */
export const toggleArrayField = async (model, resourceId, userId, field, options = {}) => {
  const { countField = null, selectExclude = null } = options;
  const select = selectExclude || `-${field}`;

  // Try to remove the user (they already liked/followed) — atomic
  const pullOp = { $pull: { [field]: userId }, ...(countField && { $inc: { [countField]: -1 } }) };
  const pulled = await model
    .findOneAndUpdate({ _id: resourceId, [field]: userId }, pullOp, { new: true })
    .select(select)
    .lean();

  if (pulled) return { ...pulled, isLiked: false };

  // User wasn't in the array — add them atomically
  const addOp = { $addToSet: { [field]: userId }, ...(countField && { $inc: { [countField]: 1 } }) };
  const added = await model
    .findOneAndUpdate({ _id: resourceId, [field]: { $ne: userId } }, addOp, { new: true })
    .select(select)
    .lean();

  if (added) return { ...added, isLiked: true };

  // Neither matched — document doesn't exist
  throw new AppError(`${model.modelName} not found`, httpStatus.NOT_FOUND);
};

/**
 * Add `isLiked` to each document based on whether the user is in the likes array.
 * Efficient: uses a single query with $in to find which docs the user liked.
 * @param {Model} model - Mongoose model
 * @param {Array} docs - Array of lean documents
 * @param {string} userId - Current user ID
 * @param {string} [field='likes'] - Array field to check
 */
export const addIsLiked = async (model, docs, userId, field = 'likes') => {
  if (!userId || docs.length === 0) return docs;

  const ids = docs.map((d) => d._id);
  const likedIds = await model
    .find({ _id: { $in: ids }, [field]: userId })
    .distinct('_id');

  const likedSet = new Set(likedIds.map((id) => id.toString()));
  return docs.map((d) => ({ ...d, isLiked: likedSet.has(d._id.toString()) }));
};
