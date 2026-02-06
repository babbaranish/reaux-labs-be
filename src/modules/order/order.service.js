import httpStatus from 'http-status';
import { Order } from './order.model.js';
import { Cart } from '../cart/cart.model.js';
import { PromoCode } from '../promo/promo.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';

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
    const promo = await PromoCode.findOne({
      code: promoCode.toUpperCase(),
      isActive: true,
    });

    if (!promo) {
      throw new AppError('Invalid promo code', httpStatus.BAD_REQUEST);
    }

    const now = new Date();
    if (promo.validFrom && now < promo.validFrom) {
      throw new AppError('Promo code is not yet valid', httpStatus.BAD_REQUEST);
    }
    if (promo.validUntil && now > promo.validUntil) {
      throw new AppError('Promo code has expired', httpStatus.BAD_REQUEST);
    }
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      throw new AppError('Promo code usage limit reached', httpStatus.BAD_REQUEST);
    }
    if (totalAmount < promo.minOrderAmount) {
      throw new AppError(
        `Minimum order amount of ${promo.minOrderAmount} not met`,
        httpStatus.BAD_REQUEST
      );
    }

    if (promo.discountType === 'percentage') {
      discount = (totalAmount * promo.discountValue) / 100;
      if (promo.maxDiscount && discount > promo.maxDiscount) {
        discount = promo.maxDiscount;
      }
    } else {
      discount = promo.discountValue;
    }

    await PromoCode.findByIdAndUpdate(promo._id, { $inc: { usedCount: 1 } });
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

  return order;
};

export const getMyOrders = async (userId, query) => {
  return paginate(Order, { userId }, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
  });
};

export const getOrderById = async (id, userId) => {
  const order = await Order.findById(id);
  if (!order) {
    throw new AppError('Order not found', httpStatus.NOT_FOUND);
  }

  if (order.userId.toString() !== userId.toString()) {
    throw new AppError('Unauthorized to view this order', httpStatus.FORBIDDEN);
  }

  return order;
};
