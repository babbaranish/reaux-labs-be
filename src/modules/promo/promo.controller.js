import httpStatus from 'http-status';
import * as promoService from './promo.service.js';
import { sendSuccess } from '../../shared/response.js';

export const createPromo = async (req, res, next) => {
  try {
    const promo = await promoService.createPromo(req.body, req.user.id);
    return sendSuccess(res, promo, httpStatus.CREATED, 'Promo code created');
  } catch (error) {
    next(error);
  }
};

export const validatePromo = async (req, res, next) => {
  try {
    const result = await promoService.validatePromo(req.body.code, req.body.orderAmount);
    return sendSuccess(res, result, httpStatus.OK, 'Promo code is valid');
  } catch (error) {
    next(error);
  }
};
