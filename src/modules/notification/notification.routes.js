import { Router } from 'express';
import * as notificationController from './notification.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, notificationController.getNotifications);
router.put('/read/:id', authenticate, notificationController.markAsRead);

export default router;
