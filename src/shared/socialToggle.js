import httpStatus from 'http-status';
import { AppError } from './appError.js';

/**
 * Toggle a user in an array field (like/follow/bookmark) with atomic operations.
 * Uses a single findOneAndUpdate per attempt to avoid race conditions.
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

  if (pulled) return pulled;

  // User wasn't in the array — add them atomically
  const addOp = { $addToSet: { [field]: userId }, ...(countField && { $inc: { [countField]: 1 } }) };
  const added = await model
    .findOneAndUpdate({ _id: resourceId, [field]: { $ne: userId } }, addOp, { new: true })
    .select(select)
    .lean();

  if (added) return added;

  // Neither matched — document doesn't exist
  throw new AppError(`${model.modelName} not found`, httpStatus.NOT_FOUND);
};
