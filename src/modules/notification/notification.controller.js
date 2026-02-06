import httpStatus from 'http-status';
import * as notificationService from './notification.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';

export const getNotifications = async (req, res, next) => {
  try {
    const { data, pagination } = await notificationService.getNotifications(
      req.user.id,
      req.query
    );
    return sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    return sendSuccess(res, notification, httpStatus.OK, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};
