import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import sanitize from 'mongo-sanitize';
import mongoose from 'mongoose';
import env from './config/env.js';

import { errorHandler, notFound } from './middleware/errorHandler.js';

import authRoutes from './modules/auth/auth.routes.js';
import userRoutes from './modules/user/user.routes.js';
import gymRoutes from './modules/gym/gym.routes.js';
import bmiRoutes from './modules/bmi/bmi.routes.js';
import dietRoutes from './modules/diet/diet.routes.js';
import postRoutes from './modules/post/post.routes.js';
import reelRoutes from './modules/reel/reel.routes.js';
import productRoutes from './modules/product/product.routes.js';
import cartRoutes from './modules/cart/cart.routes.js';
import orderRoutes from './modules/order/order.routes.js';
import paymentRoutes from './modules/payment/payment.routes.js';
import promoRoutes from './modules/promo/promo.routes.js';
import challengeRoutes from './modules/challenge/challenge.routes.js';
import notificationRoutes from './modules/notification/notification.routes.js';
import membershipRoutes from './modules/membership/membership.routes.js';
import workoutRoutes from './modules/workout/workout.routes.js';
import analyticsRoutes from './modules/analytics/analytics.routes.js';
import contactRoutes from './modules/contact/contact.routes.js';

const app = express();

// Global middleware
app.use(compression());
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
// Sanitize req.body and req.params against NoSQL injection (req.query is read-only in Express 5)
app.use((req, _res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  next();
});
app.use(cookieParser());

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (_req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const isHealthy = dbStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    success: isHealthy,
    message: isHealthy ? 'REAUX_labs API is running' : 'Service degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gyms', gymRoutes);
app.use('/api/bmi', bmiRoutes);
app.use('/api/diets', dietRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/admin', analyticsRoutes);
app.use('/api/contact', contactRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
