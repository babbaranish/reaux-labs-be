import crypto from 'node:crypto';
import httpStatus from 'http-status';
import slugify from 'slugify';
import { Gym } from './gym.model.js';
import { User } from '../user/user.model.js';
import { UserMembership } from '../membership/userMembership.model.js';
import { MembershipPlan } from '../membership/membershipPlan.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { findByIdOrFail, updateByIdOrFail } from '../../shared/crudOperations.js';

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
  // GET /gyms/:id is public — do NOT expose the (superadmin) creator's email,
  // it's a privileged account distinct from the gym's public contact info.
  return findByIdOrFail(Gym, id, { populate: { path: 'createdBy', select: 'name' } });
};

export const updateGym = async (id, data) => {
  return updateByIdOrFail(Gym, id, data);
};

export const deleteGym = async (id) => {
  return updateByIdOrFail(Gym, id, { isActive: false });
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
  // Track all gyms this admin manages
  if (!user.gymIds) user.gymIds = [];
  const gymStr = gymId.toString();
  if (!user.gymIds.map((id) => id.toString()).includes(gymStr)) {
    user.gymIds.push(gymId);
  }
  // Primary gymId = first assigned gym
  if (!user.gymId) user.gymId = gymId;
  await user.save();

  return user;
};

// ── Candidates: one-step gym-member add/remove ──────────────────────────

const isAdminGym = (adminUser, gymId) => {
  const gymStr = gymId?.toString();
  if (adminUser.gymIds?.length) {
    return adminUser.gymIds.some((id) => id.toString() === gymStr);
  }
  return adminUser.gymId?.toString() === gymStr;
};

// Candidate memberships are tracked against a per-gym default "Monthly
// Membership" plan (created lazily), since the streamlined form has no plan picker.
const getOrCreateMonthlyPlan = async (gymId, adminUserId) => {
  let plan = await MembershipPlan.findOne({ gymId, name: 'Monthly Membership' });
  if (!plan) {
    plan = await MembershipPlan.create({
      name: 'Monthly Membership',
      gymId,
      durationDays: 30,
      price: 0,
      description: 'Default monthly plan for gym candidates',
      isActive: true,
      createdBy: adminUserId,
    });
  }
  return plan;
};

export const createCandidate = async (data, adminUser) => {
  // Admins add to their own gym; superadmin may pass gymId (falls back to theirs).
  const gymId = adminUser.role === 'admin' ? adminUser.gymId : (data.gymId || adminUser.gymId);
  if (!gymId) {
    throw new AppError('No gym is associated with your account', httpStatus.BAD_REQUEST);
  }

  const gym = await Gym.findById(gymId);
  if (!gym) throw new AppError('Gym not found', httpStatus.NOT_FOUND);
  if (adminUser.role === 'admin' && !isAdminGym(adminUser, gymId)) {
    throw new AppError('You can only add candidates to your own gym', httpStatus.FORBIDDEN);
  }

  const startDate = data.startDate ? new Date(data.startDate) : new Date();

  // A candidate is a gym-managed member, not a self-service login — generate
  // unique placeholder credentials to satisfy the User schema (email/password).
  const email = `candidate.${Date.now()}.${crypto.randomBytes(4).toString('hex')}@gym.reauxlabs.local`;
  const password = crypto.randomBytes(16).toString('hex');

  const user = await User.create({
    name: data.name,
    email,
    password,
    phone: data.phone,
    ...(data.avatar && { avatar: data.avatar }),
    role: 'user',
    gymId,
    dateOfJoining: startDate,
    status: 'active',
  });

  const monthlyFees = Number.isFinite(data.monthlyFees) ? data.monthlyFees : 0;
  const plan = await getOrCreateMonthlyPlan(gymId, adminUser.id);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  const membership = await UserMembership.create({
    userId: user._id,
    planId: plan._id,
    gymId,
    startDate,
    endDate,
    assignedBy: adminUser.id,
    feesAmount: monthlyFees,
    feesPaid: 0,
    feesDue: monthlyFees > 0 ? monthlyFees : 0,
  });

  return UserMembership.findById(membership._id)
    .populate('userId', 'name avatar phone')
    .populate('planId', 'name')
    .lean();
};

export const removeCandidate = async (membershipId, adminUser) => {
  const membership = await UserMembership.findById(membershipId);
  if (!membership) {
    throw new AppError('Candidate not found', httpStatus.NOT_FOUND);
  }
  if (adminUser.role === 'admin' && !isAdminGym(adminUser, membership.gymId)) {
    throw new AppError('You can only remove candidates from your own gym', httpStatus.FORBIDDEN);
  }

  const { userId, gymId } = membership;

  // Remove the member's memberships in this gym and soft-delete the user
  // (soft delete keeps referential integrity for any posts/orders they left).
  await UserMembership.deleteMany({ userId, gymId });
  await User.findByIdAndUpdate(userId, { status: 'deleted', deletedAt: new Date() });

  return { message: 'Candidate removed' };
};
