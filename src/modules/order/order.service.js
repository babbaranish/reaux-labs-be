import httpStatus from 'http-status';
import { Order } from './order.model.js';
import { Cart } from '../cart/cart.model.js';
import { PromoCode } from '../promo/promo.model.js';
import { User } from '../user/user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { validatePromo } from '../promo/promo.service.js';
import { sendEmail } from '../../shared/emailSender.js';
import { orderConfirmationEmail } from '../../shared/emailTemplates.js';

export const createOrder = async (userId, { shippingAddress, promoCode }) => {
  const cart = await Cart.findOne({ userId }).populate('items.product', 'name price');

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', httpStatus.BAD_REQUEST);
  }

  const items = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }));

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let discount = 0;

  if (promoCode) {
    const promoResult = await validatePromo(promoCode, totalAmount);
    discount = promoResult.discount;

    await PromoCode.findOneAndUpdate(
      { code: promoCode.toUpperCase() },
      { $inc: { usedCount: 1 } }
    );
  }

  const finalAmount = totalAmount - discount;

  const order = await Order.create({
    userId,
    items,
    totalAmount,
    discount,
    finalAmount,
    promoCode: promoCode ? promoCode.toUpperCase() : undefined,
    shippingAddress,
  });

  cart.items = [];
  await cart.save();

  // Send confirmation email (fire and forget)
  User.findById(userId).select('name email').lean().then((user) => {
    if (user) {
      sendEmail({
        to: user.email,
        subject: 'Order Confirmed — REAUX Labs',
        html: orderConfirmationEmail(user.name, order),
      }).catch((err) => console.error('Order confirmation email failed:', err.message));
    }
  });

  return order;
};

export const getMyOrders = async (userId, query) => {
  return paginate(Order, { userId }, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
  });
};

export const getAllOrders = async (query) => {
  return paginate(Order, {}, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
    populate: { path: 'userId', select: 'name email' },
  });
};

export const getOrderById = async (id, userId) => {
  const order = await Order.findById(id).lean();
  if (!order) {
    throw new AppError('Order not found', httpStatus.NOT_FOUND);
  }

  if (order.userId.toString() !== userId.toString()) {
    throw new AppError('Unauthorized to view this order', httpStatus.FORBIDDEN);
  }

  return order;
};
