import httpStatus from 'http-status';
import { Challenge } from './challenge.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';

export const createChallenge = async (data, userId) => {
  const challenge = await Challenge.create({
    ...data,
    createdBy: userId,
  });
  return challenge;
};

export const getChallenges = async (query) => {
  return paginate(Challenge, { isActive: true }, {
    page: query.page,
    limit: query.limit,
    sort: { startDate: -1 },
  });
};

export const joinChallenge = async (challengeId, userId) => {
  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    throw new AppError('Challenge not found', httpStatus.NOT_FOUND);
  }

  const alreadyJoined = challenge.participants.some(
    (p) => p.userId.toString() === userId.toString()
  );

  if (alreadyJoined) {
    throw new AppError('Already joined this challenge', httpStatus.CONFLICT);
  }

  challenge.participants.push({ userId });
  await challenge.save();

  return challenge;
};
