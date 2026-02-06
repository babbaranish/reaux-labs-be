import httpStatus from 'http-status';
import * as cartService from './cart.service.js';
import { sendSuccess } from '../../shared/response.js';

export const addToCart = async (req, res, next) => {
  try {
    const cart = await cartService.addToCart(req.user.id, req.body);
    return sendSuccess(res, cart, httpStatus.OK, 'Item added to cart');
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user.id);
    return sendSuccess(res, cart);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await cartService.removeFromCart(req.user.id, req.params.productId);
    return sendSuccess(res, cart, httpStatus.OK, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
};
