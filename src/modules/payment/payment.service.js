import crypto from 'node:crypto';
import httpStatus from 'http-status';
import { Order } from '../order/order.model.js';
import { AppError } from '../../shared/appError.js';
import env from '../../config/env.js';

const RAZORPAY_API = 'https://api.razorpay.com/v1';

const requireKeys = () => {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new AppError(
      'Online payments are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
      httpStatus.SERVICE_UNAVAILABLE
    );
  }
};

const authHeader = () =>
  `Basic ${Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64')}`;

const findOwnOrder = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new AppError('Order not found', httpStatus.NOT_FOUND);
  }
  if (order.userId.toString() !== userId.toString()) {
    throw new AppError('This order belongs to someone else', httpStatus.FORBIDDEN);
  }
  return order;
};

export const createRazorpayOrder = async (orderId, userId) => {
  requireKeys();
  const order = await findOwnOrder(orderId, userId);

  if (order.paymentStatus === 'paid') {
    throw new AppError('This order is already paid', httpStatus.BAD_REQUEST);
  }

  // The amount is read from the stored order — never taken from the client, or a
  // tampered request could pay ₹1 for a ₹3000 order.
  const amountInPaise = Math.round(order.finalAmount * 100);
  if (!Number.isFinite(amountInPaise) || amountInPaise < 100) {
    throw new AppError('Order amount is not valid for online payment', httpStatus.BAD_REQUEST);
  }

  const response = await fetch(`${RAZORPAY_API}/orders`, {
    method: 'POST',
    headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order._id.toString(),
      notes: { orderId: order._id.toString() },
    }),
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body?.id) {
    throw new AppError(
      body?.error?.description || 'Could not reach Razorpay',
      httpStatus.BAD_GATEWAY
    );
  }

  order.razorpayOrderId = body.id;
  order.paymentMethod = 'online';
  await order.save();

  return {
    orderId: order._id,
    razorpayOrderId: body.id,
    amount: body.amount,
    currency: body.currency,
    // Publishable key — safe to hand to the app; the secret never leaves the server.
    keyId: env.RAZORPAY_KEY_ID,
  };
};

export const verifyPayment = async ({ razorpayOrderId, razorpayPaymentId, signature }, userId) => {
  requireKeys();

  const order = await Order.findOne({ razorpayOrderId });
  if (!order) {
    throw new AppError('No order found for this payment', httpStatus.NOT_FOUND);
  }
  if (order.userId.toString() !== userId.toString()) {
    throw new AppError('This order belongs to someone else', httpStatus.FORBIDDEN);
  }

  // Idempotent: a retry of an already-verified payment must succeed, not error.
  if (order.paymentStatus === 'paid') {
    return order;
  }

  const expected = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  const provided = String(signature || '');
  const valid =
    provided.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));

  if (!valid) {
    order.paymentStatus = 'failed';
    await order.save();
    throw new AppError('Payment could not be verified', httpStatus.BAD_REQUEST);
  }

  order.paymentStatus = 'paid';
  order.razorpayPaymentId = razorpayPaymentId;
  order.status = 'confirmed';
  await order.save();

  return order;
};

export const markPaymentFailed = async (orderId, userId) => {
  const order = await findOwnOrder(orderId, userId);
  if (order.paymentStatus !== 'paid') {
    order.paymentStatus = 'failed';
    await order.save();
  }
  return order;
};
