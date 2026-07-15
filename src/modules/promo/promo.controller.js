import httpStatus from 'http-status';
import * as promoService from './promo.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const listPromos = asyncHandler(async (req, res) => {
  const { data, pagination } = await promoService.listPromos(req.query);
  return sendPaginated(res, data, pagination);
});

export const createPromo = asyncHandler(async (req, res) => {
  const promo = await promoService.createPromo(req.body, req.user.id);
  return sendSuccess(res, promo, httpStatus.CREATED, 'Promo code created');
});

export const getPromo = asyncHandler(async (req, res) => {
  const promo = await promoService.getPromoById(req.params.id);
  return sendSuccess(res, promo);
});

export const updatePromo = asyncHandler(async (req, res) => {
  const promo = await promoService.updatePromo(req.params.id, req.body);
  return sendSuccess(res, promo, httpStatus.OK, 'Promo code updated');
});

export const validatePromo = asyncHandler(async (req, res) => {
  const result = await promoService.validatePromo(req.body.code, req.body.orderAmount);
  return sendSuccess(res, result, httpStatus.OK, 'Promo code is valid');
});
