import { Router } from 'express';
import * as reelController from './reel.controller.js';
import { authenticate, optionalAuth } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { uploadReelVideo } from '../../middleware/upload.js';
import { createCommentSchema } from './reel.validator.js';

const router = Router();

router.post(
  '/',
  authenticate,
  uploadReelVideo.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  reelController.create
);
router.get('/', optionalAuth, reelController.list);
router.get('/:id', optionalAuth, reelController.getById);
router.post('/:id/like', authenticate, reelController.like);
router.post('/:id/comment', authenticate, validate(createCommentSchema), reelController.comment);
router.get('/:id/comments', reelController.listComments);

export default router;
