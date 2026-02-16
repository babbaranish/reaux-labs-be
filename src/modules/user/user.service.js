import httpStatus from 'http-status';
import { User } from './user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { sendEmail } from '../../shared/emailSender.js';
import { welcomeEmail } from '../../shared/emailTemplates.js';

export const createUser = async ({ name, email, password, phone, role, gymId, status }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', httpStatus.CONFLICT);
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: role || 'user',
    gymId: gymId || null,
    status: status || 'active',
  });

  // Send welcome email (fire and forget)
  sendEmail({
    to: email,
    subject: 'Welcome to REAUX Labs — Your Fitness Journey Starts Now!',
    html: welcomeEmail(name, email, password),
  }).catch((err) => console.error('Welcome email failed:', err.message));

  return user;
};

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
