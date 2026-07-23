import httpStatus from 'http-status';
import { MembershipPlan } from './membershipPlan.model.js';
import { UserMembership } from './userMembership.model.js';
import { Gym } from '../gym/gym.model.js';
import { User } from '../user/user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { createNotification } from '../../shared/pushNotification.js';

// ── Plan CRUD (SuperAdmin) ──────────────────────────────

export const createPlan = async (data, adminUser) => {
  const gym = await Gym.findById(data.gymId);
  if (!gym) throw new AppError('Gym not found', httpStatus.NOT_FOUND);

  // An admin may only create plans for their own gym; superadmin any gym.
  if (adminUser.role === 'admin' && !isAdminGym(adminUser, data.gymId)) {
    throw new AppError('You can only create plans for your gym', httpStatus.FORBIDDEN);
  }

  const plan = await MembershipPlan.create({ ...data, createdBy: adminUser.id });
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

export const getPlanById = async (id, requester) => {
  const plan = await MembershipPlan.findById(id).populate(
    'gymId',
    'name slug'
  );
  if (!plan) throw new AppError('Plan not found', httpStatus.NOT_FOUND);

  // Admin may only view plans for their own gym(s); superadmin sees all.
  if (requester?.role === 'admin') {
    const gymId = plan.gymId?._id || plan.gymId;
    if (!isAdminGym(requester, gymId)) {
      throw new AppError('Plan not found', httpStatus.NOT_FOUND);
    }
  }

  return plan;
};

export const updatePlan = async (id, data, adminUser) => {
  const plan = await MembershipPlan.findById(id);
  if (!plan) throw new AppError('Plan not found', httpStatus.NOT_FOUND);

  // Admins may only touch their own gym's plans, and can't move a plan to
  // another gym.
  if (adminUser?.role === 'admin') {
    if (!isAdminGym(adminUser, plan.gymId)) {
      throw new AppError('You can only edit plans for your gym', httpStatus.FORBIDDEN);
    }
    if (data.gymId && !isAdminGym(adminUser, data.gymId)) {
      throw new AppError('You can only assign plans to your gym', httpStatus.FORBIDDEN);
    }
  }

  Object.assign(plan, data);
  await plan.save();
  return plan;
};

export const deletePlan = async (id, adminUser) => {
  const plan = await MembershipPlan.findById(id);
  if (!plan) throw new AppError('Plan not found', httpStatus.NOT_FOUND);

  if (adminUser?.role === 'admin' && !isAdminGym(adminUser, plan.gymId)) {
    throw new AppError('You can only delete plans for your gym', httpStatus.FORBIDDEN);
  }

  plan.isActive = false;
  await plan.save();
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

  // Admin can only assign memberships for their own gym(s)
  if (adminUser.role === 'admin') {
    if (!isAdminGym(adminUser, plan.gymId)) {
      throw new AppError(
        'You can only assign memberships for your gym',
        httpStatus.FORBIDDEN
      );
    }
  }

  const startDate = data.startDate ? new Date(data.startDate) : new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + plan.durationDays);

  const feesAmount = data.feesAmount ?? 0;
  const feesPaid = data.feesPaid ?? 0;
  const balance = feesAmount - feesPaid;

  const membership = await UserMembership.create({
    userId: data.userId,
    planId: data.planId,
    gymId: plan.gymId,
    startDate,
    endDate,
    assignedBy: adminUser.id,
    feesAmount,
    feesPaid,
    feesDue: balance > 0 ? balance : 0,
    advanceCredit: balance < 0 ? Math.abs(balance) : 0,
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

const isAdminGym = (adminUser, gymId) => {
  const gymStr = gymId?.toString();
  if (adminUser.gymIds?.length) {
    return adminUser.gymIds.some((id) => id.toString() === gymStr);
  }
  return adminUser.gymId?.toString() === gymStr;
};

export const recordFees = async (id, { amount, note, extendDays }, adminUser) => {
  const membership = await UserMembership.findById(id);
  if (!membership) throw new AppError('Membership not found', httpStatus.NOT_FOUND);

  if (adminUser.role === 'admin' && !isAdminGym(adminUser, membership.gymId)) {
    throw new AppError('You can only update memberships for your gym', httpStatus.FORBIDDEN);
  }

  membership.feesPaid += amount;
  const balance = membership.feesAmount - membership.feesPaid;
  membership.feesDue = balance > 0 ? balance : 0;
  membership.advanceCredit = balance < 0 ? Math.abs(balance) : 0;
  membership.lastPaymentDate = new Date();

  if (extendDays) {
    const base = membership.endDate ? new Date(membership.endDate) : new Date();
    base.setDate(base.getDate() + extendDays);
    membership.endDate = base;
    if (membership.status === 'expired') membership.status = 'active';
  }

  membership.paymentHistory.push({ amount, date: new Date(), note });
  await membership.save();
  return membership;
};

export const applyCredit = async (id, { amount, note }, adminUser) => {
  const membership = await UserMembership.findById(id);
  if (!membership) throw new AppError('Membership not found', httpStatus.NOT_FOUND);

  if (adminUser.role === 'admin' && !isAdminGym(adminUser, membership.gymId)) {
    throw new AppError('You can only update memberships for your gym', httpStatus.FORBIDDEN);
  }

  if (membership.advanceCredit <= 0) {
    throw new AppError('No advance credit available', httpStatus.BAD_REQUEST);
  }

  const dues = Math.max(membership.feesAmount - membership.feesPaid, 0);
  if (dues <= 0) {
    throw new AppError('No outstanding dues to apply credit against', httpStatus.BAD_REQUEST);
  }

  // Apply at most the credit on hand and at most what's owed. Cap feesPaid at
  // feesAmount so the balance never goes negative — the previous code let
  // feesPaid overshoot and then re-derived (doubled) advanceCredit from it.
  const applyAmount = Math.min(amount ?? membership.advanceCredit, membership.advanceCredit, dues);

  membership.advanceCredit -= applyAmount;
  membership.feesPaid += applyAmount;
  membership.feesDue = Math.max(membership.feesAmount - membership.feesPaid, 0);
  membership.lastPaymentDate = new Date();
  membership.paymentHistory.push({
    amount: applyAmount,
    date: new Date(),
    note: note || `Applied ₹${applyAmount} from advance credit to dues`,
  });

  await membership.save();
  return membership;
};

export const adjustFees = async (id, { feesAmount, feesPaid, advanceCredit, note }, adminUser) => {
  const membership = await UserMembership.findById(id);
  if (!membership) throw new AppError('Membership not found', httpStatus.NOT_FOUND);

  if (adminUser.role === 'admin' && !isAdminGym(adminUser, membership.gymId)) {
    throw new AppError('You can only update memberships for your gym', httpStatus.FORBIDDEN);
  }

  if (feesAmount !== undefined) membership.feesAmount = feesAmount;
  if (feesPaid !== undefined) membership.feesPaid = feesPaid;
  if (advanceCredit !== undefined) membership.advanceCredit = advanceCredit;

  // Recalculate derived fields unless both were explicitly set
  if (advanceCredit === undefined) {
    const balance = membership.feesAmount - membership.feesPaid;
    membership.feesDue = balance > 0 ? balance : 0;
    membership.advanceCredit = balance < 0 ? Math.abs(balance) : 0;
  } else if (feesPaid !== undefined || feesAmount !== undefined) {
    const balance = membership.feesAmount - membership.feesPaid;
    membership.feesDue = balance > 0 ? balance : 0;
  }

  if (note) {
    membership.paymentHistory.push({ amount: 0, date: new Date(), note: `[Adjustment] ${note}` });
  }

  await membership.save();
  return membership;
};

export const getMemberships = async (query, user) => {
  const filter = {};

  // Admin scoped to their gym(s)
  if (user.role === 'admin') {
    const ids = user.gymIds?.length ? user.gymIds : [user.gymId].filter(Boolean);
    filter.gymId = ids.length === 1 ? ids[0] : { $in: ids };
  } else if (query.gymId) {
    filter.gymId = query.gymId;
  }

  if (query.userId) filter.userId = query.userId;
  if (query.status) filter.status = query.status;

  const SORTABLE = { endDate: 1, feesDue: 1, createdAt: 1 };
  const sortField = SORTABLE[query.sortBy] !== undefined ? query.sortBy : 'createdAt';
  const sortOrder = query.order === 'asc' ? 1 : -1;

  return paginate(UserMembership, filter, {
    page: query.page,
    limit: query.limit,
    sort: { [sortField]: sortOrder },
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

export const getMembershipById = async (id, requester) => {
  const membership = await UserMembership.findById(id)
    .populate('userId', 'name email avatar')
    .populate('planId', 'name durationDays price features description')
    .populate('gymId', 'name slug');

  if (!membership) {
    throw new AppError('Membership not found', httpStatus.NOT_FOUND);
  }

  // Admin may only view memberships within their own gym(s); superadmin sees
  // all. 404 (not 403) so admins can't probe other gyms' membership ids.
  if (requester?.role === 'admin') {
    const gymId = membership.gymId?._id || membership.gymId;
    if (!isAdminGym(requester, gymId)) {
      throw new AppError('Membership not found', httpStatus.NOT_FOUND);
    }
  }

  return membership;
};

export const getFeesOverview = async (query, user) => {
  const gymFilter = {};

  if (user.role === 'admin') {
    const ids = user.gymIds?.length ? user.gymIds : [user.gymId].filter(Boolean);
    gymFilter.gymId = ids.length === 1 ? ids[0] : { $in: ids };
  } else if (query.gymId) {
    gymFilter.gymId = query.gymId;
  }

  const populateFields = [
    { path: 'userId', select: 'name email avatar' },
    { path: 'planId', select: 'name price' },
    { path: 'gymId', select: 'name' },
  ];

  const selectFields =
    'userId planId gymId feesAmount feesPaid feesDue advanceCredit endDate status';

  const now = new Date();
  const thirtyDaysLater = new Date(now);
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);

  const [feesDue, fullyPaid, credit, upcomingRenewals] = await Promise.all([
    // feesDue: active memberships still owing money
    UserMembership.find({ ...gymFilter, status: 'active', feesDue: { $gt: 0 } })
      .select(selectFields)
      .populate(populateFields)
      .lean(),

    // fullyPaid: active memberships with no outstanding balance and no credit
    UserMembership.find({
      ...gymFilter,
      status: 'active',
      feesDue: 0,
      advanceCredit: 0,
    })
      .select(selectFields)
      .populate(populateFields)
      .lean(),

    // credit: active memberships that have overpaid
    UserMembership.find({ ...gymFilter, status: 'active', advanceCredit: { $gt: 0 } })
      .select(selectFields)
      .populate(populateFields)
      .lean(),

    // upcomingRenewals: active memberships expiring within the next 30 days
    UserMembership.find({
      ...gymFilter,
      status: 'active',
      endDate: { $gte: now, $lte: thirtyDaysLater },
    })
      .select(selectFields)
      .populate(populateFields)
      .lean(),
  ]);

  return { feesDue, fullyPaid, credit, upcomingRenewals };
};

export const cancelMembership = async (id, adminUser) => {
  const membership = await UserMembership.findById(id);
  if (!membership) {
    throw new AppError('Membership not found', httpStatus.NOT_FOUND);
  }

  if (membership.status === 'cancelled') {
    throw new AppError('Membership is already cancelled', httpStatus.BAD_REQUEST);
  }

  // Admin can only cancel memberships for their gym(s)
  if (adminUser.role === 'admin') {
    if (!isAdminGym(adminUser, membership.gymId)) {
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
