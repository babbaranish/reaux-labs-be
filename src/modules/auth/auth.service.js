import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { User } from '../user/user.model.js';
import { AppError } from '../../shared/appError.js';
import { sendEmail } from '../../shared/emailSender.js';
import { welcomeEmail } from '../../shared/emailTemplates.js';
import env from '../../config/env.js';

const generateToken = (userId, role) =>
  jwt.sign({ userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });

export const register = async ({ name, email, password, phone, gymId }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', httpStatus.CONFLICT);
  }

  const user = await User.create({ name, email, password, phone, gymId: gymId || null });
  const token = generateToken(user._id, user.role);

  sendEmail({
    to: email,
    subject: 'Welcome to REAUX Labs — Your Fitness Journey Starts Now!',
    html: welcomeEmail(name, email, password),
  }).catch((err) => console.error('Welcome email failed:', err.message));

  return { token, user };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED);
  }

  if (user.status === 'disabled') {
    throw new AppError('Account is disabled', httpStatus.FORBIDDEN);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', httpStatus.UNAUTHORIZED);
  }

  const token = generateToken(user._id, user.role);
  return { token, user };
};

export const getProfile = async (userId) => {
  const user = await User.findById(userId)
    .populate('gymId', 'name slug logo address')
    .lean();
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }
  return user;
};

export const updateProfile = async (userId, updates) => {
  const allowedFields = ['name', 'phone', 'height', 'weight', 'dateOfBirth', 'gender', 'avatar'];
  const filteredUpdates = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) filteredUpdates[key] = updates[key];
  }

  const user = await User.findByIdAndUpdate(userId, filteredUpdates, {
    new: true,
    runValidators: true,
  }).populate('gymId', 'name slug logo address');

  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }
  return user;
};
