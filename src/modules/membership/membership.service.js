import httpStatus from 'http-status';
import { MembershipPlan } from './membershipPlan.model.js';
import { UserMembership } from './userMembership.model.js';
import { Gym } from '../gym/gym.model.js';
import { User } from '../user/user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { createNotification } from '../../shared/pushNotification.js';

// ── Plan CRUD (SuperAdmin) ──────────────────────────────

export const createPlan = async (data, userId) => {
  const gym = await Gym.findById(data.gymId);
  if (!gym) throw new AppError('Gym not found', httpStatus.NOT_FOUND);

  const plan = await MembershipPlan.create({ ...data, createdBy: userId });
  return plan;
};

export const getPlans = async (query, user) => {
  const filter = { isActive: true };

  if (user.role === 'admin') {
    filter.gymId = user.gymId;
  } else if (query.gymId) {
    filter.gymId = query.gymId;
  }

  return paginate(MembershipPlan, filter, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
    populate: { path: 'gymId', select: 'name slug' },
  });
};

export const getPlanById = async (id) => {
  const plan = await MembershipPlan.findById(id).populate(
    'gymId',
    'name slug'
  );
  if (!plan) throw new AppError('Plan not found', httpStatus.NOT_FOUND);
  return plan;
};

export const updatePlan = async (id, data) => {
  const plan = await MembershipPlan.findByIdAndUpdate(id, data, { new: true });
  if (!plan) throw new AppError('Plan not found', httpStatus.NOT_FOUND);
  return plan;
};

export const deletePlan = async (id) => {
  const plan = await MembershipPlan.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
  if (!plan) throw new AppError('Plan not found', httpStatus.NOT_FOUND);
  return plan;
};

// ── User Membership (Admin + SuperAdmin) ────────────────

export const assignMembership = async (data, adminUser) => {
  const [plan, user] = await Promise.all([
    MembershipPlan.findById(data.planId),
    User.findById(data.userId),
  ]);

  if (!plan || !plan.isActive) {
    throw new AppError('Plan not found or inactive', httpStatus.NOT_FOUND);
  }
  if (!user) {
    throw new AppError('User not found', httpStatus.NOT_FOUND);
  }

  // Admin can only assign memberships for their own gym
  if (adminUser.role === 'admin') {
    if (plan.gymId.toString() !== adminUser.gymId?.toString()) {
      throw new AppError(
        'You can only assign memberships for your gym',
        httpStatus.FORBIDDEN
      );
    }
  }

  const startDate = data.startDate ? new Date(data.startDate) : new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  const membership = await UserMembership.create({
    userId: data.userId,
    planId: data.planId,
    gymId: plan.gymId,
    startDate,
    endDate,
    assignedBy: adminUser.id,
  });

  // Notify user
  const gym = await Gym.findById(plan.gymId).select('name').lean();
  createNotification({
    userId: data.userId,
    title: 'Membership Assigned',
    message: `You've been assigned the "${plan.name}" plan at ${gym?.name || 'your gym'}`,
    type: 'system',
    metadata: { membershipId: membership._id, gymId: plan.gymId },
  }).catch(() => {});

  return membership;
};

export const getMemberships = async (query, user) => {
  const filter = {};

  // Admin scoped to their gym
  if (user.role === 'admin') {
    filter.gymId = user.gymId;
  } else if (query.gymId) {
    filter.gymId = query.gymId;
  }

  if (query.userId) filter.userId = query.userId;
  if (query.status) filter.status = query.status;

  return paginate(UserMembership, filter, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
    populate: [
      { path: 'userId', select: 'name email avatar' },
      { path: 'planId', select: 'name durationDays price features' },
      { path: 'gymId', select: 'name slug' },
    ],
  });
};

export const getMyMemberships = async (userId, query) => {
  return paginate(
    UserMembership,
    { userId },
    {
      page: query.page,
      limit: query.limit,
      sort: { createdAt: -1 },
      populate: [
        { path: 'planId', select: 'name durationDays price features description' },
        { path: 'gymId', select: 'name slug logo' },
      ],
    }
  );
};

export const getMembershipById = async (id) => {
  const membership = await UserMembership.findById(id)
    .populate('userId', 'name email avatar')
    .populate('planId', 'name durationDays price features description')
    .populate('gymId', 'name slug');

  if (!membership) {
    throw new AppError('Membership not found', httpStatus.NOT_FOUND);
  }
  return membership;
};

export const cancelMembership = async (id, adminUser) => {
  const membership = await UserMembership.findById(id);
  if (!membership) {
    throw new AppError('Membership not found', httpStatus.NOT_FOUND);
  }

  if (membership.status === 'cancelled') {
    throw new AppError('Membership is already cancelled', httpStatus.BAD_REQUEST);
  }

  // Admin can only cancel memberships for their gym
  if (adminUser.role === 'admin') {
    if (membership.gymId.toString() !== adminUser.gymId?.toString()) {
      throw new AppError(
        'You can only cancel memberships for your gym',
        httpStatus.FORBIDDEN
      );
    }
  }

  membership.status = 'cancelled';
  await membership.save();

  // Notify user
  const plan = await MembershipPlan.findById(membership.planId)
    .select('name')
    .lean();
  createNotification({
    userId: membership.userId,
    title: 'Membership Cancelled',
    message: `Your "${plan?.name || 'membership'}" has been cancelled`,
    type: 'system',
    metadata: { membershipId: membership._id },
  }).catch(() => {});

  return membership;
};
