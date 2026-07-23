import { Router } from 'express';
import * as contactController from './contact.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { submitContactSchema } from './contact.validator.js';

const router = Router();

// Public — submit contact form
router.post('/', validate(submitContactSchema), contactController.submit);

// Superadmin only — contact submissions are a global support inbox with no gym
// association, so a gym admin must not read every user's messages/PII.
router.get('/', authenticate, authorize('superadmin'), contactController.list);

// Superadmin only — mark a contact submission as resolved
router.patch('/:id/resolve', authenticate, authorize('superadmin'), contactController.resolve);

export default router;
