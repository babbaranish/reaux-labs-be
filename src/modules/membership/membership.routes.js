import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import {
  createPlanSchema,
  updatePlanSchema,
  assignMembershipSchema,
} from './membership.validator.js';
import * as ctrl from './membership.controller.js';

const router = Router();

// ── Plans (SuperAdmin creates, Admin+SuperAdmin can view) ──

router.post(
  '/plans',
  authenticate,
  authorize('superadmin'),
  validate(createPlanSchema),
  ctrl.createPlan
);

router.get(
  '/plans',
  authenticate,
  authorize('admin', 'superadmin'),
  ctrl.getPlans
);

router.get(
  '/plans/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  ctrl.getPlanById
);

router.put(
  '/plans/:id',
  authenticate,
  authorize('superadmin'),
  validate(updatePlanSchema),
  ctrl.updatePlan
);

router.delete(
  '/plans/:id',
  authenticate,
  authorize('superadmin'),
  ctrl.deletePlan
);

// ── User Memberships ──

router.post(
  '/assign',
  authenticate,
  authorize('admin', 'superadmin'),
  validate(assignMembershipSchema),
  ctrl.assignMembership
);

router.get(
  '/my',
  authenticate,
  ctrl.getMyMemberships
);

router.get(
  '/',
  authenticate,
  authorize('admin', 'superadmin'),
  ctrl.getMemberships
);

router.get(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  ctrl.getMembershipById
);

router.patch(
  '/:id/cancel',
  authenticate,
  authorize('admin', 'superadmin'),
  ctrl.cancelMembership
);

export default router;
