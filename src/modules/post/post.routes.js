import { Router } from 'express';
import * as postController from './post.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { createPostSchema, createCommentSchema } from './post.validator.js';

const router = Router();

router.post('/', authenticate, validate(createPostSchema), postController.create);
router.get('/', authenticate, postController.list);
router.get('/:id', authenticate, postController.getById);
router.post('/:id/like', authenticate, postController.like);
router.post('/:id/comment', authenticate, validate(createCommentSchema), postController.comment);

export default router;
