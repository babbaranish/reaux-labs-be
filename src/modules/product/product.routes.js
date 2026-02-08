import { Router } from 'express';
import * as productController from './product.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { uploadProductImages } from '../../middleware/upload.js';
import { createProductSchema, updateProductSchema } from './product.validator.js';

const router = Router();

router.get('/', productController.list);
router.get('/:id', productController.getById);
router.post('/', authenticate, authorize('admin', 'superadmin'), uploadProductImages.array('images', 5), validate(createProductSchema), productController.create);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), uploadProductImages.array('images', 5), validate(updateProductSchema), productController.update);

export default router;
