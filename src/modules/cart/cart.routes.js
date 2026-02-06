import { Router } from 'express';
import * as cartController from './cart.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { addToCartSchema, removeFromCartSchema } from './cart.validator.js';

const router = Router();

router.post('/add', authenticate, validate(addToCartSchema), cartController.addToCart);
router.get('/', authenticate, cartController.getCart);
router.delete('/item/:productId', authenticate, validate(removeFromCartSchema), cartController.removeFromCart);

export default router;
