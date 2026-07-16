import httpStatus from 'http-status';
import * as cartService from './cart.service.js';
import { sendSuccess } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const addToCart = asyncHandler(async (req, res) => {
  const cart = await cartService.addToCart(req.user.id, req.body);
  return sendSuccess(res, cart, httpStatus.OK, 'Item added to cart');
});

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user.id);
  return sendSuccess(res, cart);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const cart = await cartService.updateCartItemQuantity(
    req.user.id,
    req.params.productId,
    req.body.quantity,
    req.body.flavour
  );
  return sendSuccess(res, cart, httpStatus.OK, 'Cart updated');
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await cartService.removeFromCart(
    req.user.id,
    req.params.productId,
    req.query.flavour
  );
  return sendSuccess(res, cart, httpStatus.OK, 'Item removed from cart');
});
