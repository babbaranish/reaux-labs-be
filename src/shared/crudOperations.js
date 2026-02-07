import httpStatus from 'http-status';
import { AppError } from './appError.js';

/**
 * Find a document by ID or throw 404.
 */
export const findByIdOrFail = async (model, id, options = {}) => {
  const { populate = '', select = '' } = options;
  const query = model.findById(id);

  if (populate) query.populate(populate);
  if (select) query.select(select);

  const doc = await query.lean();

  if (!doc) {
    throw new AppError(`${model.modelName} not found`, httpStatus.NOT_FOUND);
  }

  return doc;
};

/**
 * Update a document by ID or throw 404.
 */
export const updateByIdOrFail = async (model, id, data, options = {}) => {
  const doc = await model.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    ...options,
  });

  if (!doc) {
    throw new AppError(`${model.modelName} not found`, httpStatus.NOT_FOUND);
  }

  return doc;
};
