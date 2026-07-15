import { Router } from 'express';
import * as promoController from './promo.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createPromoSchema, updatePromoSchema, validatePromoSchema } from './promo.validator.js';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize('admin', 'superadmin'),
  promoController.listPromos
);
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
router.get(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  promoController.getPromo
);
router.put(
  '/:id',
  authenticate,
  authorize('superadmin'),
  validate(updatePromoSchema),
  promoController.updatePromo
);

export default router;
