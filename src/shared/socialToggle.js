import httpStatus from 'http-status';
import { AppError } from './appError.js';

/**
 * Toggle a user in an array field (like/follow/bookmark) with atomic operations.
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

  const alreadyExists = await model.exists({ _id: resourceId, [field]: userId });

  const updateOp = alreadyExists
    ? { $pull: { [field]: userId }, ...(countField && { $inc: { [countField]: -1 } }) }
    : { $addToSet: { [field]: userId }, ...(countField && { $inc: { [countField]: 1 } }) };

  const query = alreadyExists
    ? { _id: resourceId, [field]: userId }
    : { _id: resourceId, [field]: { $ne: userId } };

  const resource = await model
    .findOneAndUpdate(query, updateOp, { new: true })
    .select(select)
    .lean();

  if (!resource) {
    throw new AppError(`${model.modelName} not found`, httpStatus.NOT_FOUND);
  }

  return resource;
};
