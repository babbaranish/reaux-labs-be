import { Router } from 'express';
import * as gymController from './gym.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { uploadGymImages, uploadProfileImage } from '../../middleware/upload.js';
import { createGymSchema, updateGymSchema, assignAdminSchema, createCandidateSchema } from './gym.validator.js';

const router = Router();

// Candidates (gym-member management) — declared before '/:id' routes.
router.post('/candidates', authenticate, authorize('admin', 'superadmin'), uploadProfileImage.single('avatar'), validate(createCandidateSchema), gymController.createCandidate);
router.delete('/candidates/:id', authenticate, authorize('admin', 'superadmin'), gymController.removeCandidate);

router.post('/', authenticate, authorize('superadmin'), uploadGymImages.fields([{ name: 'images', maxCount: 5 }, { name: 'logo', maxCount: 1 }]), validate(createGymSchema), gymController.create);
router.get('/', gymController.list);
router.get('/:id', gymController.getById);
router.put('/:id', authenticate, authorize('superadmin'), uploadGymImages.fields([{ name: 'images', maxCount: 5 }, { name: 'logo', maxCount: 1 }]), validate(updateGymSchema), gymController.update);
router.delete('/:id', authenticate, authorize('superadmin'), gymController.remove);
router.post('/:id/assign-admin', authenticate, authorize('superadmin'), validate(assignAdminSchema), gymController.assignAdmin);

export default router;
