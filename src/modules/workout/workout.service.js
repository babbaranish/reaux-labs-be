import httpStatus from 'http-status';
import { Workout } from './workout.model.js';
import { paginate } from '../../shared/pagination.js';
import { findByIdOrFail, updateByIdOrFail } from '../../shared/crudOperations.js';
import { AppError } from '../../shared/appError.js';

// Only the creator or a superadmin may mutate a workout.
const assertCanMutateWorkout = async (id, requester) => {
  const existing = await Workout.findById(id).select('createdBy');
  if (!existing) throw new AppError('Workout not found', httpStatus.NOT_FOUND);
  if (requester?.role !== 'superadmin' && existing.createdBy?.toString() !== requester?.id?.toString()) {
    throw new AppError('You can only modify workouts you created', httpStatus.FORBIDDEN);
  }
};

export const createWorkout = async (data, userId) => {
  const workout = await Workout.create({ ...data, createdBy: userId });
  return workout;
};

export const getWorkouts = async (query) => {
  const filter = { isPublished: true };

  if (query.category) filter.category = query.category;
  if (query.difficulty) filter.difficulty = query.difficulty;
  if (query.tag) filter.tags = { $in: [query.tag] };

  return paginate(Workout, filter, {
    page: query.page,
    limit: query.limit,
    sort: query.sort || { createdAt: -1 },
    populate: { path: 'createdBy', select: 'name avatar' },
  });
};

export const getWorkoutById = async (id) => {
  return findByIdOrFail(Workout, id, {
    populate: { path: 'createdBy', select: 'name avatar' },
  });
};

export const updateWorkout = async (id, data, requester) => {
  await assertCanMutateWorkout(id, requester);
  return updateByIdOrFail(Workout, id, data);
};

export const deleteWorkout = async (id, requester) => {
  await assertCanMutateWorkout(id, requester);
  return updateByIdOrFail(Workout, id, { isPublished: false });
};
