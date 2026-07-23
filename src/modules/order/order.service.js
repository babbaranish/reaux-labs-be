import httpStatus from 'http-status';
import { Order } from './order.model.js';
import { Cart } from '../cart/cart.model.js';
import { PromoCode } from '../promo/promo.model.js';
import { Product } from '../product/product.model.js';
import { User } from '../user/user.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';
import { validatePromo } from '../promo/promo.service.js';
import { sendEmail } from '../../shared/emailSender.js';
import { orderConfirmationEmail, newOrderAdminEmail } from '../../shared/emailTemplates.js';
import { createNotification } from '../../shared/pushNotification.js';

export const createOrder = async (userId, { shippingAddress, promoCode, paymentMethod = 'cod' }) => {
  const cart = await Cart.findOne({ userId }).populate('items.product', 'name price stock');

  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', httpStatus.BAD_REQUEST);
  }

  // A product may have been deleted since it was added — previously this threw a
  // 500 on the null `item.product`. Surface a clear, actionable error instead.
  if (cart.items.some((item) => !item.product)) {
    throw new AppError(
      'A product in your cart is no longer available. Please review your cart and try again.',
      httpStatus.BAD_REQUEST,
    );
  }

  // Reserve stock atomically and race-safely (no replica-set transaction needed):
  // each decrement only succeeds while enough stock remains; if any line fails,
  // roll back the ones already taken and reject the order.
  const reserved = [];
  for (const item of cart.items) {
    const res = await Product.updateOne(
      { _id: item.product._id, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
    );
    if (res.modifiedCount === 0) {
      for (const r of reserved) {
        await Product.updateOne({ _id: r.id }, { $inc: { stock: r.qty } });
      }
      throw new AppError(`Insufficient stock for ${item.product.name}`, httpStatus.BAD_REQUEST);
    }
    reserved.push({ id: item.product._id, qty: item.quantity });
  }

  const items = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    flavour: item.flavour || undefined,
  }));

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  let discount = 0;

  if (promoCode) {
    const promoResult = await validatePromo(promoCode, totalAmount);
    discount = promoResult.discount;

    // Atomically claim one use — the update only matches while still under the
    // limit, closing the check-then-increment race that let a code exceed its
    // usageLimit under concurrent orders.
    const claimed = await PromoCode.findOneAndUpdate(
      {
        code: promoCode.toUpperCase(),
        isActive: true,
        $or: [{ usageLimit: null }, { $expr: { $lt: ['$usedCount', '$usageLimit'] } }],
      },
      { $inc: { usedCount: 1 } },
      { new: true },
    );
    if (!claimed) {
      throw new AppError('Promo code usage limit reached', httpStatus.BAD_REQUEST);
    }
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
    paymentMethod,
    paymentStatus: 'pending',
  });

  cart.items = [];
  await cart.save();

  // Send confirmation email + push (fire and forget)
  User.findById(userId).select('name email').lean().then((user) => {
    if (user) {
      sendEmail({
        to: user.email,
        subject: 'Order Confirmed — REAUX Labs',
        html: orderConfirmationEmail(user.name, order),
      }).catch((err) => console.error('Order confirmation email failed:', err.message));
    }
  });

  // Send new order notification (email + push) to all superadmins (fire and forget)
  User.findById(userId).select('name email').lean().then((user) => {
    if (user) {
      User.find({ role: 'superadmin' }).select('_id email').lean().then((superadmins) => {
        superadmins.forEach((admin) => {
          sendEmail({
            to: admin.email,
            subject: '🎉 New Order Received — REAUX Labs',
            html: newOrderAdminEmail(user.name, user.email, order),
          }).catch((err) => console.error('Admin order notification email failed:', err.message));

          createNotification({
            userId: admin._id,
            title: 'New Order Received',
            message: `${user.name} placed an order for ₹${order.finalAmount}`,
            type: 'order',
            metadata: { orderId: order._id, status: 'pending' },
          }).catch(() => {});
        });
      });
    }
  });

  createNotification({
    userId,
    title: 'Order Placed',
    message: `Your order #${order._id} for ₹${order.finalAmount} has been placed successfully!`,
    type: 'order',
    metadata: { orderId: order._id, status: 'pending' },
  }).catch(() => {});

  return order;
};

export const getMyOrders = async (userId, query) => {
  const filter = { userId };
  if (query.status) filter.status = query.status;

  return paginate(Order, filter, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
  });
};

export const getAllOrders = async (query, requester) => {
  const filter = {};
  if (query.status) filter.status = query.status;

  // Admin sees only orders placed by members of their own gym(s); superadmin
  // sees all. Orders carry no gymId, so resolve the gym's user ids first.
  if (requester?.role === 'admin') {
    const gymIds = requester.gymIds?.length ? requester.gymIds : [requester.gymId].filter(Boolean);
    const userIds = await User.find({ gymId: { $in: gymIds } }).distinct('_id');
    filter.userId = { $in: userIds };
  }

  return paginate(Order, filter, {
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
