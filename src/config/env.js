import 'dotenv/config';

const env = Object.freeze({
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/reaux-labs',

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  // Set both on Render to enable online payments. Without them, checkout stays
  // Cash on Delivery only and the payment endpoints return 503.
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,

  BREVO_API_KEY: process.env.BREVO_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@reauxlabs.com',
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'REAUX Labs',

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  // Base URL used to build the password-reset link that is emailed to the user.
  // Defaults to the mobile app's deep link scheme so tapping the link opens the
  // app straight on the reset screen. Override with a web URL if a web app exists.
  PASSWORD_RESET_URL: process.env.PASSWORD_RESET_URL || 'reauxlabs://reset-password',

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),

  FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
  FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
});

if (!env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is required. Set it in .env');
}

if (!env.MONGO_URI) {
  console.warn('WARNING: MONGO_URI is not set. Using default localhost');
}

export default env;
