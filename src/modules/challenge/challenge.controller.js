import httpStatus from 'http-status';
import * as challengeService from './challenge.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const createChallenge = asyncHandler(async (req, res) => {
  const challenge = await challengeService.createChallenge(req.body, req.user.id);
  return sendSuccess(res, challenge, httpStatus.CREATED, 'Challenge created');
});

export const getChallenges = asyncHandler(async (req, res) => {
  const { data, pagination } = await challengeService.getChallenges(req.query);
  return sendPaginated(res, data, pagination);
});

export const joinChallenge = asyncHandler(async (req, res) => {
  const challenge = await challengeService.joinChallenge(req.params.id, req.user.id);
  return sendSuccess(res, challenge, httpStatus.OK, 'Joined challenge successfully');
});

export const updateChallenge = asyncHandler(async (req, res) => {
  const challenge = await challengeService.updateChallenge(req.params.id, req.body);
  return sendSuccess(res, challenge, httpStatus.OK, 'Challenge updated');
});

export const deleteChallenge = asyncHandler(async (req, res) => {
  await challengeService.deleteChallenge(req.params.id);
  return sendSuccess(res, null, httpStatus.OK, 'Challenge deleted');
});
