import { Router } from 'express';
import * as orderController from './order.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { createOrderSchema } from './order.validator.js';

const router = Router();

router.post('/create', authenticate, validate(createOrderSchema), orderController.createOrder);
router.get('/my', authenticate, orderController.getMyOrders);
router.get('/:id', authenticate, orderController.getOrderById);

export default router;
