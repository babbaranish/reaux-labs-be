import httpStatus from 'http-status';
import * as membershipService from './membership.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// ── Plans ───────────────────────────────────────────────

export const createPlan = asyncHandler(async (req, res) => {
  const plan = await membershipService.createPlan(req.body, req.user.id);
  return sendSuccess(res, plan, httpStatus.CREATED, 'Membership plan created');
});

export const getPlans = asyncHandler(async (req, res) => {
  const { data, pagination } = await membershipService.getPlans(
    req.query,
    req.user
  );
  return sendPaginated(res, data, pagination);
});

export const getPlanById = asyncHandler(async (req, res) => {
  const plan = await membershipService.getPlanById(req.params.id);
  return sendSuccess(res, plan);
});

export const updatePlan = asyncHandler(async (req, res) => {
  const plan = await membershipService.updatePlan(req.params.id, req.body);
  return sendSuccess(res, plan, httpStatus.OK, 'Plan updated');
});

export const deletePlan = asyncHandler(async (req, res) => {
  await membershipService.deletePlan(req.params.id);
  return sendSuccess(res, null, httpStatus.OK, 'Plan deleted');
});

// ── User Memberships ────────────────────────────────────

export const assignMembership = asyncHandler(async (req, res) => {
  const membership = await membershipService.assignMembership(
    req.body,
    req.user
  );
  return sendSuccess(
    res,
    membership,
    httpStatus.CREATED,
    'Membership assigned'
  );
});

export const getMemberships = asyncHandler(async (req, res) => {
  const { data, pagination } = await membershipService.getMemberships(
    req.query,
    req.user
  );
  return sendPaginated(res, data, pagination);
});

export const getMyMemberships = asyncHandler(async (req, res) => {
  const { data, pagination } = await membershipService.getMyMemberships(
    req.user.id,
    req.query
  );
  return sendPaginated(res, data, pagination);
});

export const getMembershipById = asyncHandler(async (req, res) => {
  const membership = await membershipService.getMembershipById(req.params.id);
  return sendSuccess(res, membership);
});

export const recordFees = asyncHandler(async (req, res) => {
  const membership = await membershipService.recordFees(req.params.id, req.body, req.user);
  return sendSuccess(res, membership, httpStatus.OK, 'Payment recorded');
});

export const applyCredit = asyncHandler(async (req, res) => {
  const membership = await membershipService.applyCredit(req.params.id, req.body, req.user);
  return sendSuccess(res, membership, httpStatus.OK, 'Credit applied to dues');
});

export const adjustFees = asyncHandler(async (req, res) => {
  const membership = await membershipService.adjustFees(req.params.id, req.body, req.user);
  return sendSuccess(res, membership, httpStatus.OK, 'Fees adjusted');
});

export const getFeesOverview = asyncHandler(async (req, res) => {
  const data = await membershipService.getFeesOverview(req.query, req.user);
  return sendSuccess(res, data);
});

export const cancelMembership = asyncHandler(async (req, res) => {
  const membership = await membershipService.cancelMembership(
    req.params.id,
    req.user
  );
  return sendSuccess(res, membership, httpStatus.OK, 'Membership cancelled');
});
