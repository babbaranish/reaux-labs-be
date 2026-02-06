import { Router } from 'express';
import * as reelController from './reel.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { uploadReelVideo } from '../../middleware/upload.js';

const router = Router();

router.post('/', authenticate, uploadReelVideo.single('video'), reelController.create);
router.get('/', reelController.list);
router.get('/:id', reelController.getById);
router.post('/:id/like', authenticate, reelController.like);

export default router;
