import { Router } from 'express';
import * as dietController from './diet.controller.js';
import { authenticate, optionalAuth } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { uploadDietImage } from '../../middleware/upload.js';
import { createDietSchema, updateDietSchema } from './diet.validator.js';

const router = Router();

router.post('/', authenticate, authorize('admin', 'superadmin'), uploadDietImage.single('image'), validate(createDietSchema), dietController.create);
router.put('/:id', authenticate, authorize('admin', 'superadmin'), uploadDietImage.single('image'), validate(updateDietSchema), dietController.update);
router.get('/suggested', authenticate, dietController.getSuggested);
router.get('/', optionalAuth, dietController.list);
router.get('/:id', optionalAuth, dietController.getById);
router.post('/:id/follow', authenticate, dietController.follow);
router.post('/:id/like', authenticate, dietController.like);

export default router;
