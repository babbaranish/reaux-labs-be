import cron from 'node-cron';
import { User } from '../modules/user/user.model.js';
import { sendEmail } from '../shared/emailSender.js';
import { birthdayEmail } from '../shared/emailTemplates.js';
import { createNotification } from '../shared/pushNotification.js';

const checkBirthdays = async () => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    // Find all active users whose birthday is today (match month and day)
    const birthdayUsers = await User.find({
      status: 'active',
      dateOfBirth: { $exists: true, $ne: null },
      $expr: {
        $and: [
          { $eq: [{ $month: '$dateOfBirth' }, month] },
          { $eq: [{ $dayOfMonth: '$dateOfBirth' }, day] },
        ],
      },
    })
      .select('name email _id')
      .lean();

    if (birthdayUsers.length === 0) {
      console.log('[Birthday Job] No birthdays today');
      return;
    }

    console.log(`[Birthday Job] Found ${birthdayUsers.length} birthday(s) today`);

    // Get all admins and superadmins for notifications
    const staff = await User.find({
      role: { $in: ['admin', 'superadmin'] },
      status: 'active',
    })
      .select('_id')
      .lean();

    for (const user of birthdayUsers) {
      // 1. Send birthday email to the user
      sendEmail({
        to: user.email,
        subject: `Happy Birthday, ${user.name}! 🎂 — REAUX Labs`,
        html: birthdayEmail(user.name),
      }).catch((err) => console.error(`[Birthday Job] Email failed for ${user.email}:`, err.message));

      // 2. Send push notification to the user
      createNotification({
        userId: user._id,
        title: 'Happy Birthday! 🎂',
        message: `Wishing you a wonderful birthday, ${user.name}! Stay strong and keep crushing your goals!`,
        type: 'birthday',
        metadata: { birthdayUserId: user._id },
      }).catch(() => {});

      // 3. Notify all admins and superadmins (in-app + push)
      for (const admin of staff) {
        // Skip if the admin IS the birthday user
        if (admin._id.toString() === user._id.toString()) continue;

        createNotification({
          userId: admin._id,
          title: '🎂 Birthday Alert!',
          message: `It's ${user.name}'s birthday today! Wish them well!`,
          type: 'birthday',
          metadata: { birthdayUserId: user._id, birthdayUserName: user.name, birthdayUserEmail: user.email },
        }).catch(() => {});
      }
    }

    console.log(`[Birthday Job] Processed ${birthdayUsers.length} birthday notification(s)`);
  } catch (error) {
    console.error('[Birthday Job] Error:', error.message);
  }
};

export const startBirthdayJob = () => {
  // Run daily at 12:00 AM IST (UTC+5:30 = 18:30 UTC previous day)
  cron.schedule('0 0 * * *', checkBirthdays, {
    timezone: 'Asia/Kolkata',
  });

  console.log('[Birthday Job] Scheduled — runs daily at 12:00 AM IST');
};

// Export for manual testing
export { checkBirthdays };
