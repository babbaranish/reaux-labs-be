import httpStatus from 'http-status';
import { Notification } from './notification.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';

export const getNotifications = async (userId, query) => {
  const filter = { userId };

  if (query.type) {
    filter.type = query.type;
  }

  if (query.isRead !== undefined) {
    filter.isRead = query.isRead === 'true';
  }

  return paginate(Notification, filter, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
  });
};

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { isRead: true },
    { new: true }
  ).lean();

  if (!notification) {
    throw new AppError('Notification not found', httpStatus.NOT_FOUND);
  }

  return notification;
};

export const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );

  return { modifiedCount: result.modifiedCount };
};
