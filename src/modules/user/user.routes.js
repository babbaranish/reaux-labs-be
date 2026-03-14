import { Router } from 'express';
import * as userController from './user.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createUserSchema, updateUserSchema, updateUserRoleSchema, updateUserStatusSchema, savedAddressSchema, updateSavedAddressSchema } from './user.validator.js';

const router = Router();

// ── Saved Addresses (any authenticated user manages their own) ──
router.get('/addresses', authenticate, userController.getAddresses);
router.post('/addresses', authenticate, validate(savedAddressSchema), userController.addAddress);
router.put('/addresses/:addressId', authenticate, validate(updateSavedAddressSchema), userController.updateAddress);
router.delete('/addresses/:addressId', authenticate, userController.deleteAddress);

router.post('/', authenticate, authorize('admin', 'superadmin'), validate(createUserSchema), userController.createUser);
router.get('/birthdays/today', authenticate, authorize('admin', 'superadmin'), userController.getTodayBirthdays);
router.get('/birthdays/upcoming', authenticate, authorize('admin', 'superadmin'), userController.getUpcomingBirthdays);
router.get('/', authenticate, authorize('admin', 'superadmin'), userController.getUsers);
router.get('/:id', authenticate, authorize('admin', 'superadmin'), userController.getUserById);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), validate(updateUserSchema), userController.updateUser);
router.put('/:id/role', authenticate, authorize('superadmin'), validate(updateUserRoleSchema), userController.updateUserRole);
router.put('/:id/status', authenticate, authorize('superadmin'), validate(updateUserStatusSchema), userController.updateUserStatus);

export default router;
