import admin from 'firebase-admin';
import firebaseApp from '../config/firebase.js';
import { Notification } from '../modules/notification/notification.model.js';
import { User } from '../modules/user/user.model.js';

/**
 * Send push notification to all of a user's devices.
 * Silently skips if Firebase is not configured.
 * Automatically removes invalid/expired tokens.
 */
export const sendPush = async (userId, { title, body, data = {} }) => {
  if (!firebaseApp) return null;

  const user = await User.findById(userId).select('fcmTokens').lean();
  if (!user?.fcmTokens?.length) return null;

  const stringData = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, String(v)])
  );

  const messages = user.fcmTokens.map((token) => ({
    token,
    notification: { title, body },
    data: stringData,
  }));

  const response = await admin.messaging().sendEach(messages);

  // Remove invalid tokens
  const tokensToRemove = [];
  response.responses.forEach((res, i) => {
    if (
      res.error &&
      (res.error.code === 'messaging/registration-token-not-registered' ||
        res.error.code === 'messaging/invalid-registration-token')
    ) {
      tokensToRemove.push(user.fcmTokens[i]);
    }
  });

  if (tokensToRemove.length) {
    await User.updateOne(
      { _id: userId },
      { $pull: { fcmTokens: { $in: tokensToRemove } } }
    );
  }

  return response;
};

/**
 * Create an in-app notification AND send a push notification.
 * Single entry point for all modules to notify users.
 */
export const createNotification = async ({
  userId,
  title,
  message,
  type = 'system',
  metadata,
}) => {
  const [notification] = await Promise.all([
    Notification.create({ userId, title, message, type, metadata }),
    sendPush(userId, {
      title,
      body: message,
      data: { type, ...(metadata || {}) },
    }).catch((err) => console.error('Push notification failed:', err.message)),
  ]);

  return notification;
};
