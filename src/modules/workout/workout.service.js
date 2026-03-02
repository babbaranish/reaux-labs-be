import { Workout } from './workout.model.js';
import { paginate } from '../../shared/pagination.js';
import { findByIdOrFail, updateByIdOrFail } from '../../shared/crudOperations.js';

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

export const updateWorkout = async (id, data) => {
  return updateByIdOrFail(Workout, id, data);
};

export const deleteWorkout = async (id) => {
  return updateByIdOrFail(Workout, id, { isPublished: false });
};
