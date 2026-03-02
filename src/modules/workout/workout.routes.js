import { Router } from 'express';
import * as workoutController from './workout.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createWorkoutSchema, updateWorkoutSchema } from './workout.validator.js';

const router = Router();

router.post('/', authenticate, authorize('admin', 'superadmin'), validate(createWorkoutSchema), workoutController.create);
router.get('/', workoutController.list);
router.get('/:id', workoutController.getById);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), validate(updateWorkoutSchema), workoutController.update);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), workoutController.remove);

export default router;
