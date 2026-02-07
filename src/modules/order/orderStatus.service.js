import httpStatus from 'http-status';
import { Order } from './order.model.js';
import { Notification } from '../notification/notification.model.js';
import { AppError } from '../../shared/appError.js';

const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

const STATUS_MESSAGES = {
  confirmed: 'Your order has been confirmed',
  shipped: 'Your order has been shipped',
  delivered: 'Your order has been delivered',
  cancelled: 'Your order has been cancelled',
};

export const updateOrderStatus = async (orderId, newStatus) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', httpStatus.NOT_FOUND);
  }

  const allowed = STATUS_TRANSITIONS[order.status];
  if (!allowed.includes(newStatus)) {
    throw new AppError(
      `Cannot transition from '${order.status}' to '${newStatus}'`,
      httpStatus.BAD_REQUEST
    );
  }

  order.status = newStatus;
  await order.save();

  // Notify the user
  await Notification.create({
    userId: order.userId,
    title: 'Order Update',
    message: STATUS_MESSAGES[newStatus],
    type: 'order',
    metadata: { orderId: order._id, status: newStatus },
  });

  return order;
};
