import httpStatus from 'http-status';
import * as workoutService from './workout.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const workout = await workoutService.createWorkout(req.body, req.user.id);
  return sendSuccess(res, workout, httpStatus.CREATED, 'Workout created successfully');
});

export const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await workoutService.getWorkouts(req.query);
  return sendPaginated(res, data, pagination);
});

export const getById = asyncHandler(async (req, res) => {
  const workout = await workoutService.getWorkoutById(req.params.id);
  return sendSuccess(res, workout);
});

export const update = asyncHandler(async (req, res) => {
  const workout = await workoutService.updateWorkout(req.params.id, req.body);
  return sendSuccess(res, workout, httpStatus.OK, 'Workout updated successfully');
});

export const remove = asyncHandler(async (req, res) => {
  await workoutService.deleteWorkout(req.params.id);
  return sendSuccess(res, null, httpStatus.OK, 'Workout deleted successfully');
});
