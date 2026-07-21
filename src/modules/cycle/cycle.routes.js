import { Router } from 'express';
import * as cycleController from './cycle.controller.js';
import { authenticate, optionalAuth } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { uploadCycleImage } from '../../middleware/upload.js';
import { createCycleSchema, updateCycleSchema } from './cycle.validator.js';

const router = Router();

router.post('/', authenticate, authorize('admin', 'superadmin'), uploadCycleImage.single('image'), validate(createCycleSchema), cycleController.create);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), uploadCycleImage.single('image'), validate(updateCycleSchema), cycleController.update);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), cycleController.remove);
router.get('/', optionalAuth, cycleController.list);
router.get('/:id', optionalAuth, cycleController.getById);
router.post('/:id/follow', authenticate, cycleController.follow);
router.post('/:id/like', authenticate, cycleController.like);

export default router;
