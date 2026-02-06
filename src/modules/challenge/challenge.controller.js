import httpStatus from 'http-status';
import * as challengeService from './challenge.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';

export const createChallenge = async (req, res, next) => {
  try {
    const challenge = await challengeService.createChallenge(req.body, req.user.id);
    return sendSuccess(res, challenge, httpStatus.CREATED, 'Challenge created');
  } catch (error) {
    next(error);
  }
};

export const getChallenges = async (req, res, next) => {
  try {
    const { data, pagination } = await challengeService.getChallenges(req.query);
    return sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
};

export const joinChallenge = async (req, res, next) => {
  try {
    const challenge = await challengeService.joinChallenge(req.params.id, req.user.id);
    return sendSuccess(res, challenge, httpStatus.OK, 'Joined challenge successfully');
  } catch (error) {
    next(error);
  }
};
