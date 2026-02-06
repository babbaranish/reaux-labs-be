import httpStatus from 'http-status';
import { Cart } from './cart.model.js';
import { AppError } from '../../shared/appError.js';

export const addToCart = async (userId, { productId, quantity = 1 }) => {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, items: [{ product: productId, quantity }] });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  return cart.populate('items.product', 'name price images stock');
};

export const getCart = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate(
    'items.product',
    'name price images stock'
  );
  return cart || { userId, items: [] };
};

export const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new AppError('Cart not found', httpStatus.NOT_FOUND);
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  await cart.save();
  return cart.populate('items.product', 'name price images stock');
};
