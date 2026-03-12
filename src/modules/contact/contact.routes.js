import { Router } from 'express';
import * as contactController from './contact.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { submitContactSchema } from './contact.validator.js';

const router = Router();

// Public — submit contact form
router.post('/', validate(submitContactSchema), contactController.submit);

// Admin+superadmin — list all contact submissions
router.get('/', authenticate, authorize('admin', 'superadmin'), contactController.list);

// Admin+superadmin — mark a contact submission as resolved
router.patch('/:id/resolve', authenticate, authorize('admin', 'superadmin'), contactController.resolve);

export default router;
