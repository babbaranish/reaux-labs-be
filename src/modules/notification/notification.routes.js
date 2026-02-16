import { Router } from 'express';
import * as notificationController from './notification.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { fcmTokenSchema } from './notification.validator.js';

const router = Router();

router.get('/', authenticate, notificationController.getNotifications);
router.put('/read/:id', authenticate, notificationController.markAsRead);
router.patch('/mark-all-read', authenticate, notificationController.markAllAsRead);
router.post('/test', authenticate, notificationController.sendTestNotification);

// Device push token management (Expo)
router.post('/device-token', authenticate, validate(fcmTokenSchema), notificationController.registerFcmToken);
router.delete('/device-token', authenticate, validate(fcmTokenSchema), notificationController.removeFcmToken);

// Legacy FCM endpoints (backward compatibility)
router.post('/fcm-token', authenticate, validate(fcmTokenSchema), notificationController.registerFcmToken);
router.delete('/fcm-token', authenticate, validate(fcmTokenSchema), notificationController.removeFcmToken);

export default router;
