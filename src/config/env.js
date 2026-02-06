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

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@reauxlabs.com',

  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',

  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
});

if (!env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set. Using default (NOT FOR PRODUCTION)');
}

if (!env.MONGO_URI) {
  console.warn('WARNING: MONGO_URI is not set. Using default localhost');
}

export default env;
