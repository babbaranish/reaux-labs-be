import httpStatus from 'http-status';
import * as notificationService from './notification.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const { data, pagination } = await notificationService.getNotifications(
    req.user.id,
    req.query
  );
  return sendPaginated(res, data, pagination);
});

export const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await notificationService.getNotificationById(req.params.id, req.user.id);
  return sendSuccess(res, notification, httpStatus.OK, 'Notification retrieved');
});

export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user.id);
  return sendSuccess(res, notification, httpStatus.OK, 'Notification marked as read');
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  return sendSuccess(res, result, httpStatus.OK, 'All notifications marked as read');
});

export const registerFcmToken = asyncHandler(async (req, res) => {
  await notificationService.registerFcmToken(req.user.id, req.body.token);
  return sendSuccess(res, null, httpStatus.OK, 'FCM token registered');
});

export const removeFcmToken = asyncHandler(async (req, res) => {
  await notificationService.removeFcmToken(req.user.id, req.body.token);
  return sendSuccess(res, null, httpStatus.OK, 'FCM token removed');
});

export const sendTestNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.sendTestNotification(req.user.id);
  return sendSuccess(res, result, httpStatus.OK, 'Test notification sent');
});

export const broadcastNotification = asyncHandler(async (req, res) => {
  const result = await notificationService.broadcastNotification(req.body, req.user);
  return sendSuccess(res, result, httpStatus.OK, result.message);
});
