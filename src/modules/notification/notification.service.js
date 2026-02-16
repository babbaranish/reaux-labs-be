import httpStatus from 'http-status';
import { Notification } from './notification.model.js';
import { User } from '../user/user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { createNotification, sendPush } from '../../shared/pushNotification.js';

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

export const registerFcmToken = async (userId, token) => {
  await User.updateOne(
    { _id: userId },
    { $addToSet: { fcmTokens: token } }
  );
};

export const removeFcmToken = async (userId, token) => {
  await User.updateOne(
    { _id: userId },
    { $pull: { fcmTokens: token } }
  );
};

export const sendTestNotification = async (userId) => {
  const notification = await createNotification({
    userId,
    title: '🎉 Test Notification',
    message: 'REAUX Labs push notifications are working perfectly!',
    type: 'system',
    metadata: { source: 'test-endpoint', timestamp: new Date().toISOString() },
  });

  return {
    notificationId: notification._id,
    message: 'Test notification sent successfully',
  };
};

export const broadcastNotification = async ({ title, message, type = 'announcement', metadata = {} }) => {
  // Get all active users
  const users = await User.find({ status: 'active' }).select('_id').lean();

  if (users.length === 0) {
    return { sent: 0, failed: 0, message: 'No active users found' };
  }

  let sent = 0;
  let failed = 0;

  // Send notification to each user (batch process to avoid overwhelming the system)
  const batchSize = 100;
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);

    await Promise.allSettled(
      batch.map(async (user) => {
        try {
          await createNotification({
            userId: user._id,
            title,
            message,
            type,
            metadata: { ...metadata, broadcast: true },
          });
          sent++;
        } catch (error) {
          console.error(`Failed to send notification to user ${user._id}:`, error.message);
          failed++;
        }
      })
    );
  }

  return {
    sent,
    failed,
    total: users.length,
    message: `Broadcast sent to ${sent} users${failed > 0 ? `, ${failed} failed` : ''}`,
  };
};
