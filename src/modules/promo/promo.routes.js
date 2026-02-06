import { Router } from 'express';
import * as promoController from './promo.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createPromoSchema, validatePromoSchema } from './promo.validator.js';

const router = Router();

router.post(
  '/create',
  authenticate,
  authorize('superadmin'),
  validate(createPromoSchema),
  promoController.createPromo
);
router.post(
  '/validate',
  authenticate,
  validate(validatePromoSchema),
  promoController.validatePromo
);

export default router;
