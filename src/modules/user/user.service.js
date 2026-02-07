import httpStatus from 'http-status';
import { User } from './user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';

export const getUsers = async (query) => {
  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.gymId) filter.gymId = query.gymId;

  return paginate(User, filter, {
    page: query.page,
    limit: query.limit,
    populate: { path: 'gymId', select: 'name slug logo' },
    select: '-password',
  });
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select('-password').populate('gymId', 'name slug logo address').lean();
  if (!user) throw new AppError('User not found', httpStatus.NOT_FOUND);
  return user;
};

export const updateUserRole = async (id, role) => {
  const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
  if (!user) throw new AppError('User not found', httpStatus.NOT_FOUND);
  return user;
};

export const updateUserStatus = async (id, status) => {
  const user = await User.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  if (!user) throw new AppError('User not found', httpStatus.NOT_FOUND);
  return user;
};
