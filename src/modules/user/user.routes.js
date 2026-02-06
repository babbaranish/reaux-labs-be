import { Router } from 'express';
import * as userController from './user.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { updateUserRoleSchema, updateUserStatusSchema } from './user.validator.js';

const router = Router();

router.get('/', authenticate, authorize('admin', 'superadmin'), userController.getUsers);
router.get('/:id', authenticate, authorize('admin', 'superadmin'), userController.getUserById);
router.put('/:id/role', authenticate, authorize('superadmin'), validate(updateUserRoleSchema), userController.updateUserRole);
router.put('/:id/status', authenticate, authorize('superadmin'), validate(updateUserStatusSchema), userController.updateUserStatus);

export default router;
