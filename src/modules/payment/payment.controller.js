import httpStatus from 'http-status';
import * as paymentService from './payment.service.js';
import { sendSuccess } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const result = await paymentService.createRazorpayOrder(req.body.orderId, req.user.id);
  return sendSuccess(res, result, httpStatus.CREATED, 'Razorpay order created');
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const order = await paymentService.verifyPayment(req.body, req.user.id);
  return sendSuccess(res, order, httpStatus.OK, 'Payment verified');
});

export const markFailed = asyncHandler(async (req, res) => {
  const order = await paymentService.markPaymentFailed(req.body.orderId, req.user.id);
  return sendSuccess(res, order, httpStatus.OK, 'Payment marked as failed');
});
