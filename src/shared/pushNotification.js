import expo from '../config/expo.js';
import { Notification } from '../modules/notification/notification.model.js';
import { User } from '../modules/user/user.model.js';

/**
 * Send push notification to all of a user's devices using Expo.
 * Automatically removes invalid/expired tokens.
 */
export const sendPush = async (userId, { title, body, data = {} }) => {
  const user = await User.findById(userId).select('fcmTokens').lean();
  if (!user?.fcmTokens?.length) return null;

  // Filter valid Expo push tokens
  const validTokens = user.fcmTokens.filter((token) =>
    expo.isExpoPushToken(token)
  );

  if (validTokens.length === 0) {
    console.log(`No valid Expo push tokens for user ${userId}`);
    return null;
  }

  // Create messages for Expo
  const messages = validTokens.map((token) => ({
    to: token,
    sound: 'default',
    title,
    body,
    data: data || {},
    badge: 1,
    priority: 'high',
  }));

  // Send notifications in chunks of 100 (Expo recommendation)
  const chunks = expo.chunkPushNotifications(messages);
  const receipts = [];
  const tokensToRemove = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      receipts.push(...ticketChunk);

      // Check for errors and mark invalid tokens for removal
      ticketChunk.forEach((ticket, index) => {
        if (ticket.status === 'error') {
          if (
            ticket.details?.error === 'DeviceNotRegistered' ||
            ticket.message?.includes('not registered')
          ) {
            const tokenIndex = validTokens[index];
            tokensToRemove.push(tokenIndex);
          }
          console.error(`Push notification error:`, ticket.message);
        }
      });
    } catch (error) {
      console.error('Error sending push notification chunk:', error.message);
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

  return receipts;
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
