import { Router } from 'express';
import * as challengeController from './challenge.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { createChallengeSchema, updateChallengeSchema } from './challenge.validator.js';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('admin', 'superadmin'),
  validate(createChallengeSchema),
  challengeController.createChallenge
);
router.get('/', authenticate, challengeController.getChallenges);
router.post('/:id/join', authenticate, challengeController.joinChallenge);
router.put(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  validate(updateChallengeSchema),
  challengeController.updateChallenge
);
router.delete(
  '/:id',
  authenticate,
  authorize('admin', 'superadmin'),
  challengeController.deleteChallenge
);

export default router;
