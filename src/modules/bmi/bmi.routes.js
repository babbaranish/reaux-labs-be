import { Router } from 'express';
import * as bmiController from './bmi.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { recordBmiSchema } from './bmi.validator.js';

const router = Router();

router.post('/record', authenticate, validate(recordBmiSchema), bmiController.record);
router.get('/history', authenticate, bmiController.getHistory);
router.get('/latest', authenticate, bmiController.getLatest);

export default router;
