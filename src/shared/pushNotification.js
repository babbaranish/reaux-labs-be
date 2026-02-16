import admin from 'firebase-admin';
import firebaseApp from '../config/firebase.js';
import { Notification } from '../modules/notification/notification.model.js';
import { User } from '../modules/user/user.model.js';

/**
 * Send push notification to all of a user's devices using Firebase Admin SDK.
 * Automatically removes invalid/expired tokens.
 */
export const sendPush = async (userId, { title, body, data = {} }) => {
  if (!firebaseApp) {
    console.warn('Firebase not configured. Skipping push notification.');
    return null;
  }

  const user = await User.findById(userId).select('fcmTokens').lean();
  if (!user?.fcmTokens?.length) return null;

  const validTokens = user.fcmTokens.filter((token) => token && token.length > 0);

  if (validTokens.length === 0) {
    console.log(`No valid FCM tokens for user ${userId}`);
    return null;
  }

  // Create FCM message payload
  const message = {
    notification: {
      title,
      body,
    },
    data: data || {},
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        channelId: 'default',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  };

  const results = [];
  const tokensToRemove = [];

  // Send to each token
  for (const token of validTokens) {
    try {
      const response = await admin.messaging().send({
        ...message,
        token,
      });
      results.push({ token, success: true, messageId: response });
    } catch (error) {
      console.error(`Push notification error for token ${token}:`, error.code);

      // Remove invalid tokens
      if (
        error.code === 'messaging/invalid-registration-token' ||
        error.code === 'messaging/registration-token-not-registered'
      ) {
        tokensToRemove.push(token);
      }

      results.push({ token, success: false, error: error.code });
    }
  }

  // Remove invalid tokens from database
  if (tokensToRemove.length > 0) {
    await User.updateOne(
      { _id: userId },
      { $pull: { fcmTokens: { $in: tokensToRemove } } }
    );
    console.log(`Removed ${tokensToRemove.length} invalid tokens for user ${userId}`);
  }

  return results;
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
