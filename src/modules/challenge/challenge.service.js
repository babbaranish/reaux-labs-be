import httpStatus from 'http-status';
import { Challenge } from './challenge.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { createNotification } from '../../shared/pushNotification.js';

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

  createNotification({
    userId,
    title: 'Challenge Joined',
    message: `You joined "${challenge.title}". Good luck!`,
    type: 'challenge',
    metadata: { challengeId },
  }).catch(() => {});

  return challenge;
};

export const updateChallenge = async (challengeId, data) => {
  const challenge = await Challenge.findByIdAndUpdate(challengeId, data, {
    new: true,
    runValidators: true,
  }).select('-participants');

  if (!challenge) {
    throw new AppError('Challenge not found', httpStatus.NOT_FOUND);
  }

  return challenge;
};

export const deleteChallenge = async (challengeId) => {
  const challenge = await Challenge.findByIdAndDelete(challengeId);

  if (!challenge) {
    throw new AppError('Challenge not found', httpStatus.NOT_FOUND);
  }

  return challenge;
};
