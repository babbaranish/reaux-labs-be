import { Router } from 'express';
import * as reelController from './reel.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { createReelSchema } from './reel.validator.js';

const router = Router();

router.post('/', authenticate, validate(createReelSchema), reelController.create);
router.get('/', reelController.list);
router.post('/:id/like', authenticate, reelController.like);

export default router;
