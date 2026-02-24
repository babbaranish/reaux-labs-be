import httpStatus from 'http-status';
import { User } from './user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { sendEmail } from '../../shared/emailSender.js';
import { welcomeEmail } from '../../shared/emailTemplates.js';

export const createUser = async ({ name, email, password, phone, role, gymId, gender, dateOfBirth, status }) => {
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
    gender,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
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

export const getUsers = async (query, user) => {
  const filter = {};
  if (query.role) filter.role = query.role;

  // Admin sees only regular users from their gym (no admins/superadmins)
  if (user.role === 'admin') {
    filter.gymId = user.gymId;
    filter.role = 'user';
  } else if (query.gymId) {
    filter.gymId = query.gymId;
  }

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

export const getTodayBirthdays = async (user) => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const filter = {
    status: 'active',
    dateOfBirth: { $exists: true, $ne: null },
    $expr: {
      $and: [
        { $eq: [{ $month: '$dateOfBirth' }, month] },
        { $eq: [{ $dayOfMonth: '$dateOfBirth' }, day] },
      ],
    },
  };

  // Admin sees only their gym's users
  if (user.role === 'admin') {
    filter.gymId = user.gymId;
    filter.role = 'user';
  }

  return User.find(filter)
    .select('name email avatar dateOfBirth gymId')
    .populate('gymId', 'name slug')
    .lean();
};

export const getUpcomingBirthdays = async (user, days = 7) => {
  const today = new Date();
  const dates = [];

  // Build array of upcoming month/day pairs
  for (let i = 0; i <= days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push({ month: d.getMonth() + 1, day: d.getDate() });
  }

  const filter = {
    status: 'active',
    dateOfBirth: { $exists: true, $ne: null },
    $expr: {
      $or: dates.map(({ month, day }) => ({
        $and: [
          { $eq: [{ $month: '$dateOfBirth' }, month] },
          { $eq: [{ $dayOfMonth: '$dateOfBirth' }, day] },
        ],
      })),
    },
  };

  // Admin sees only their gym's users
  if (user.role === 'admin') {
    filter.gymId = user.gymId;
    filter.role = 'user';
  }

  const users = await User.find(filter)
    .select('name email avatar dateOfBirth gymId')
    .populate('gymId', 'name slug')
    .lean();

  // Add daysUntil for each user
  return users.map((u) => {
    const dob = new Date(u.dateOfBirth);
    const bday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (bday < today) bday.setFullYear(bday.getFullYear() + 1);
    const diffMs = bday - today;
    const daysUntil = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return { ...u, daysUntil };
  }).sort((a, b) => a.daysUntil - b.daysUntil);
};
