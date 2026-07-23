import httpStatus from 'http-status';
import { Order } from './order.model.js';
import { User } from '../user/user.model.js';
import { Product } from '../product/product.model.js';
import { PromoCode } from '../promo/promo.model.js';
import { createNotification } from '../../shared/pushNotification.js';
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

export const updateOrderStatus = async (orderId, newStatus, requester) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', httpStatus.NOT_FOUND);
  }

  // Admin may only mutate orders placed by members of their own gym(s);
  // superadmin may act on any order. Orders carry no gymId, so check the buyer.
  if (requester?.role === 'admin') {
    const gymIds = requester.gymIds?.length ? requester.gymIds : [requester.gymId].filter(Boolean);
    const buyer = await User.findById(order.userId).select('gymId');
    const buyerGym = buyer?.gymId?.toString();
    if (!gymIds.some((gid) => gid.toString() === buyerGym)) {
      throw new AppError('Order not found', httpStatus.NOT_FOUND);
    }
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

  // Cancelling returns the reserved stock and the promo redemption so a
  // cancelled order doesn't permanently consume inventory or a promo use.
  if (newStatus === 'cancelled') {
    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }
    if (order.promoCode) {
      await PromoCode.updateOne(
        { code: order.promoCode.toUpperCase(), usedCount: { $gt: 0 } },
        { $inc: { usedCount: -1 } },
      );
    }
  }

  // Notify the user (in-app + push)
  await createNotification({
    userId: order.userId,
    title: 'Order Update',
    message: STATUS_MESSAGES[newStatus],
    type: 'order',
    metadata: { orderId: order._id, status: newStatus },
  });

  return order;
};
