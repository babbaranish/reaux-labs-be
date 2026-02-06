import httpStatus from 'http-status';
import slugify from 'slugify';
import { Gym } from './gym.model.js';
import { User } from '../user/user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';

export const createGym = async (data, userId) => {
  const slug = slugify(data.name, { lower: true, strict: true });

  const existingGym = await Gym.findOne({ slug });
  if (existingGym) {
    throw new AppError('A gym with this name already exists', httpStatus.CONFLICT);
  }

  const gym = await Gym.create({ ...data, slug, createdBy: userId });
  return gym;
};

export const getGyms = async (query) => {
  const filter = { isActive: true };

  if (query.city) {
    filter['address.city'] = { $regex: new RegExp(query.city, 'i') };
  }

  return paginate(Gym, filter, {
    page: query.page,
    limit: query.limit,
    sort: query.sort || { createdAt: -1 },
  });
};

export const getGymById = async (id) => {
  const gym = await Gym.findById(id)
    .populate('createdBy', 'name email')
    .lean();
  if (!gym) {
    throw new AppError('Gym not found', httpStatus.NOT_FOUND);
  }
  return gym;
};

export const updateGym = async (id, data) => {
  const gym = await Gym.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!gym) {
    throw new AppError('Gym not found', httpStatus.NOT_FOUND);
  }
  return gym;
};

export const deleteGym = async (id) => {
  const gym = await Gym.findByIdAndUpdate(id, { isActive: false }, { new: true });
  if (!gym) {
    throw new AppError('Gym not found', httpStatus.NOT_FOUND);
  }
  return gym;
};

export const assignAdmin = async (gymId, userId) => {
  const [gym, user] = await Promise.all([
    Gym.findById(gymId),
    User.findById(userId),
  ]);

  if (!gym) {
    throw new AppError('Gym not found', httpStatus.NOT_FOUND);
  }
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  user.role = 'admin';
  user.gymId = gymId;
  await user.save();

  return user;
};
