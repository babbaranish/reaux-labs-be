import httpStatus from 'http-status';
import { Cart } from './cart.model.js';
import { AppError } from '../../shared/appError.js';

export const addToCart = async (userId, { productId, quantity = 1, flavour }) => {
  // A cart line is identified by product + flavour, so the same product in two
  // flavours stacks as two lines instead of merging into one.
  const line = flavour || null;

  // Try atomic increment if this exact product+flavour line is already in the cart
  let cart = await Cart.findOneAndUpdate(
    { userId, items: { $elemMatch: { product: productId, flavour: line } } },
    { $inc: { 'items.$.quantity': quantity } },
    { new: true }
  );

  if (!cart) {
    // Line not in cart — add it (upsert creates the cart if needed)
    cart = await Cart.findOneAndUpdate(
      { userId },
      { $push: { items: { product: productId, quantity, flavour: line } } },
      { new: true, upsert: true }
    );
  }

  return cart.populate('items.product', 'name price images stock flavours');
};

export const getCart = async (userId) => {
  const cart = await Cart.findOne({ userId })
    .populate('items.product', 'name price images stock flavours')
    .lean();
  return cart || { userId, items: [] };
};

export const updateCartItemQuantity = async (userId, productId, quantity, flavour) => {
  // Keep per-flavour lines distinct: a null flavour is its own line.
  const line = flavour || null;

  let cart;
  if (quantity <= 0) {
    // Non-positive quantity removes the line entirely.
    cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { product: productId, flavour: line } } },
      { new: true }
    );
  } else {
    cart = await Cart.findOneAndUpdate(
      { userId, items: { $elemMatch: { product: productId, flavour: line } } },
      { $set: { 'items.$.quantity': quantity } },
      { new: true }
    );
  }

  if (!cart) {
    throw new AppError('Cart not found', httpStatus.NOT_FOUND);
  }

  return cart.populate('items.product', 'name price images stock flavours');
};

export const removeFromCart = async (userId, productId, flavour) => {
  // With no flavour given, drop every line for that product (older clients).
  const match = flavour ? { product: productId, flavour } : { product: productId };

  const cart = await Cart.findOneAndUpdate(
    { userId },
    { $pull: { items: match } },
    { new: true }
  );

  if (!cart) {
    throw new AppError('Cart not found', httpStatus.NOT_FOUND);
  }

  return cart.populate('items.product', 'name price images stock flavours');
};
