import { Router } from 'express';
import * as analyticsController from './analytics.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

// Superadmin only — these are platform-wide counts. The mobile admin dashboard
// (and its Analytics screen) is already gated to superadmin, and gym admins get
// their gym-scoped numbers from the Members/fees views instead.
router.get('/stats', authenticate, authorize('superadmin'), analyticsController.getStats);
router.get('/sales-report', authenticate, authorize('superadmin'), analyticsController.getSalesReport);

export default router;
