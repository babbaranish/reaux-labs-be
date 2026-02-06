import { Router } from 'express';
import * as gymController from './gym.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createGymSchema, updateGymSchema, assignAdminSchema } from './gym.validator.js';

const router = Router();

router.post('/', authenticate, authorize('superadmin'), validate(createGymSchema), gymController.create);
router.get('/', gymController.list);
router.get('/:id', gymController.getById);
router.put('/:id', authenticate, authorize('superadmin'), validate(updateGymSchema), gymController.update);
router.delete('/:id', authenticate, authorize('superadmin'), gymController.remove);
router.post('/:id/assign-admin', authenticate, authorize('superadmin'), validate(assignAdminSchema), gymController.assignAdmin);

export default router;
