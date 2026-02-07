import httpStatus from 'http-status';
import * as orderService from './order.service.js';
import * as orderStatusService from './orderStatus.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(req.user.id, req.body);
  return sendSuccess(res, order, httpStatus.CREATED, 'Order placed successfully');
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const { data, pagination } = await orderService.getMyOrders(req.user.id, req.query);
  return sendPaginated(res, data, pagination);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user.id);
  return sendSuccess(res, order);
});

export const updateStatus = asyncHandler(async (req, res) => {
  const order = await orderStatusService.updateOrderStatus(req.params.id, req.body.status);
  return sendSuccess(res, order, httpStatus.OK, 'Order status updated');
});
