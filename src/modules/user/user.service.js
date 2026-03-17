import httpStatus from 'http-status';
import { User } from './user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { sendEmail } from '../../shared/emailSender.js';
import { welcomeEmail } from '../../shared/emailTemplates.js';

export const createUser = async ({ name, firstName, lastName, email, password, phone, role, gymId, gender, dateOfBirth, dateOfJoining, status }, creatingUser) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', httpStatus.CONFLICT);
  }

  // Derive name from firstName + lastName if name not provided
  const resolvedName = name || (firstName && lastName ? `${firstName} ${lastName}`.trim() : firstName || lastName || email.split('@')[0]);
  // Admin auto-assigns their own gym
  const resolvedGymId = creatingUser?.role === 'admin' ? creatingUser.gymId : (gymId || null);

  const user = await User.create({
    name: resolvedName,
    firstName,
    lastName,
    email,
    password,
    phone,
    role: role || 'user',
    gymId: resolvedGymId,
    gender,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : undefined,
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

  // Admin sees only regular users from their gym(s) (no admins/superadmins)
  if (user.role === 'admin') {
    const ids = user.gymIds?.length ? user.gymIds : [user.gymId].filter(Boolean);
    filter.gymId = ids.length === 1 ? ids[0] : { $in: ids };
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

export const updateUser = async (id, updates, adminUser) => {
  const targetUser = await User.findById(id);
  if (!targetUser) throw new AppError('User not found', httpStatus.NOT_FOUND);

  // Admin can only update users in their gym(s)
  if (adminUser.role === 'admin') {
    const adminGymIds = adminUser.gymIds?.length ? adminUser.gymIds : [adminUser.gymId].filter(Boolean);
    const targetGymStr = targetUser.gymId?.toString();
    if (!adminGymIds.some((id) => id.toString() === targetGymStr)) {
      throw new AppError('You can only update users in your gym', httpStatus.FORBIDDEN);
    }
    // Admin cannot change role or gymId
    delete updates.role;
    delete updates.gymId;
  }

  const allowedFields = ['name', 'firstName', 'lastName', 'phone', 'role', 'gymId', 'gender', 'dateOfBirth', 'dateOfJoining', 'status'];
  const dateFields = ['dateOfBirth', 'dateOfJoining'];
  const filteredUpdates = {};
  for (const key of allowedFields) {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = dateFields.includes(key) ? new Date(updates[key]) : updates[key];
    }
  }
  // Auto-update name if firstName or lastName changed
  if (filteredUpdates.firstName || filteredUpdates.lastName) {
    const current = await User.findById(id).select('firstName lastName').lean();
    const first = filteredUpdates.firstName || current?.firstName || '';
    const last = filteredUpdates.lastName || current?.lastName || '';
    if (first || last) filteredUpdates.name = `${first} ${last}`.trim();
  }

  const user = await User.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  })
    .select('-password')
    .populate('gymId', 'name slug logo address');

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
    const ids = user.gymIds?.length ? user.gymIds : [user.gymId].filter(Boolean);
    filter.gymId = ids.length === 1 ? ids[0] : { $in: ids };
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
    const ids = user.gymIds?.length ? user.gymIds : [user.gymId].filter(Boolean);
    filter.gymId = ids.length === 1 ? ids[0] : { $in: ids };
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


// ── Saved Addresses ──────────────────────────────────────

export const getAddresses = async (userId) => {
  const user = await User.findById(userId).select('savedAddresses');
  if (!user) throw new AppError('User not found', httpStatus.NOT_FOUND);
  return user.savedAddresses;
};

export const addAddress = async (userId, data) => {
  const user = await User.findById(userId).select('savedAddresses');
  if (!user) throw new AppError('User not found', httpStatus.NOT_FOUND);

  // If new address is default, unset all others
  if (data.isDefault) {
    user.savedAddresses.forEach((a) => { a.isDefault = false; });
  }

  // Auto-set as default if this is the first address
  if (user.savedAddresses.length === 0) {
    data.isDefault = true;
  }

  user.savedAddresses.push(data);
  await user.save();
  return user.savedAddresses;
};

export const updateAddress = async (userId, addressId, data) => {
  const user = await User.findById(userId).select('savedAddresses');
  if (!user) throw new AppError('User not found', httpStatus.NOT_FOUND);

  const address = user.savedAddresses.id(addressId);
  if (!address) throw new AppError('Address not found', httpStatus.NOT_FOUND);

  if (data.isDefault) {
    user.savedAddresses.forEach((a) => { a.isDefault = false; });
  }

  Object.assign(address, data);
  await user.save();
  return user.savedAddresses;
};

export const deleteAddress = async (userId, addressId) => {
  const user = await User.findById(userId).select('savedAddresses');
  if (!user) throw new AppError('User not found', httpStatus.NOT_FOUND);

  const address = user.savedAddresses.id(addressId);
  if (!address) throw new AppError('Address not found', httpStatus.NOT_FOUND);

  const wasDefault = address.isDefault;
  address.deleteOne();

  // If deleted address was default, make the first remaining one default
  if (wasDefault && user.savedAddresses.length > 0) {
    user.savedAddresses[0].isDefault = true;
  }

  await user.save();
  return user.savedAddresses;
};
