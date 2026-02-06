import httpStatus from 'http-status';
import { PromoCode } from './promo.model.js';
import { AppError } from '../../shared/appError.js';

export const createPromo = async (data, userId) => {
  const promo = await PromoCode.create({
    ...data,
    code: data.code.toUpperCase(),
    createdBy: userId,
  });
  return promo;
};

export const validatePromo = async (code, orderAmount = 0) => {
  const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });

  if (!promo) {
    throw new AppError('Invalid or inactive promo code', httpStatus.NOT_FOUND);
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
  if (orderAmount < promo.minOrderAmount) {
    throw new AppError(
      `Minimum order amount of ${promo.minOrderAmount} not met`,
      httpStatus.BAD_REQUEST
    );
  }

  let discount = 0;
  if (promo.discountType === 'percentage') {
    discount = (orderAmount * promo.discountValue) / 100;
    if (promo.maxDiscount && discount > promo.maxDiscount) {
      discount = promo.maxDiscount;
    }
  } else {
    discount = promo.discountValue;
  }

  return {
    code: promo.code,
    discountType: promo.discountType,
    discountValue: promo.discountValue,
    discount,
  };
};
