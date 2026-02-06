import httpStatus from 'http-status';
import * as orderService from './order.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';

export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    return sendSuccess(res, order, httpStatus.CREATED, 'Order placed successfully');
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const { data, pagination } = await orderService.getMyOrders(req.user.id, req.query);
    return sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user.id);
    return sendSuccess(res, order);
  } catch (error) {
    next(error);
  }
};
