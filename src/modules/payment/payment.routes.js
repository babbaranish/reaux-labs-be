import { Router } from 'express';
import * as paymentController from './payment.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import {
  createRazorpayOrderSchema,
  verifyPaymentSchema,
  markFailedSchema,
} from './payment.validator.js';

const router = Router();

router.post(
  '/razorpay/order',
  authenticate,
  validate(createRazorpayOrderSchema),
  paymentController.createRazorpayOrder
);
router.post(
  '/razorpay/verify',
  authenticate,
  validate(verifyPaymentSchema),
  paymentController.verifyPayment
);
router.post(
  '/razorpay/failed',
  authenticate,
  validate(markFailedSchema),
  paymentController.markFailed
);

export default router;
