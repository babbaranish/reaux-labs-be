import httpStatus from 'http-status';
import { Cart } from './cart.model.js';
import { AppError } from '../../shared/appError.js';

export const addToCart = async (userId, { productId, quantity = 1 }) => {
  // Try atomic increment if item already in cart
  let cart = await Cart.findOneAndUpdate(
    { userId, 'items.product': productId },
    { $inc: { 'items.$.quantity': quantity } },
    { new: true }
  );

  if (!cart) {
    // Item not in cart — add it (upsert creates cart if needed)
    cart = await Cart.findOneAndUpdate(
      { userId, 'items.product': { $ne: productId } },
      { $push: { items: { product: productId, quantity } } },
      { new: true, upsert: true }
    );
  }

  return cart.populate('items.product', 'name price images stock');
};

export const getCart = async (userId) => {
  const cart = await Cart.findOne({ userId })
    .populate('items.product', 'name price images stock')
    .lean();
  return cart || { userId, items: [] };
};

export const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $pull: { items: { product: productId } } },
    { new: true }
  );

  if (!cart) {
    throw new AppError('Cart not found', httpStatus.NOT_FOUND);
  }

  return cart.populate('items.product', 'name price images stock');
};
