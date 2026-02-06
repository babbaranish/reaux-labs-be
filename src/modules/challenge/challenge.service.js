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
    select: '-participants',
  });
};

export const joinChallenge = async (challengeId, userId) => {
  const challenge = await Challenge.findOneAndUpdate(
    { _id: challengeId, 'participants.userId': { $ne: userId } },
    { $push: { participants: { userId } } },
    { new: true }
  ).select('-participants').lean();

  if (!challenge) {
    const exists = await Challenge.exists({ _id: challengeId });
    if (!exists) {
      throw new AppError('Challenge not found', httpStatus.NOT_FOUND);
    }
    throw new AppError('Already joined this challenge', httpStatus.CONFLICT);
  }

  return challenge;
};
