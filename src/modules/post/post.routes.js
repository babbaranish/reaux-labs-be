import { Router } from 'express';
import * as postController from './post.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { uploadPostMedia } from '../../middleware/upload.js';
import { createPostSchema, createCommentSchema } from './post.validator.js';

const router = Router();

router.post(
  '/',
  authenticate,
  uploadPostMedia.single('media'),
  postController.attachUploadedMedia,
  validate(createPostSchema),
  postController.create
);
router.get('/', authenticate, postController.list);
router.get('/:id', authenticate, postController.getById);
router.get('/:id/analytics', authenticate, postController.analytics);
router.post('/:id/like', authenticate, postController.like);
router.post('/:id/comment', authenticate, validate(createCommentSchema), postController.comment);
router.delete('/:id', authenticate, authorize('superadmin'), postController.deletePost);
router.delete('/:id/comments/:commentId', authenticate, postController.deleteComment);

export default router;
