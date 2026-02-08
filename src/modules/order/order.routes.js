import { Router } from 'express';
import * as orderController from './order.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createOrderSchema, updateOrderStatusSchema } from './order.validator.js';

const router = Router();

router.post('/create', authenticate, validate(createOrderSchema), orderController.createOrder);
router.get('/my', authenticate, orderController.getMyOrders);
router.get('/', authenticate, authorize('admin', 'superadmin'), orderController.getAllOrders);
router.get('/:id', authenticate, orderController.getOrderById);
router.patch('/:id/status', authenticate, authorize('admin', 'superadmin'), validate(updateOrderStatusSchema), orderController.updateStatus);

export default router;
