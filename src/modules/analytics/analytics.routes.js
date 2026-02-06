import { Router } from 'express';
import * as analyticsController from './analytics.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';

const router = Router();

router.get('/stats', authenticate, authorize('admin', 'superadmin'), analyticsController.getStats);
router.get('/sales-report', authenticate, authorize('superadmin'), analyticsController.getSalesReport);

export default router;
