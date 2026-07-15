import httpStatus from 'http-status';
import { PromoCode } from './promo.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';

export const listPromos = async (query) => {
  const filter = {};

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true';
  }

  if (query.search) {
    filter.code = { $regex: query.search, $options: 'i' };
  }

  return paginate(PromoCode, filter, {
    page: query.page,
    limit: query.limit,
    sort: { createdAt: -1 },
  });
};

export const createPromo = async (data, userId) => {
  const promo = await PromoCode.create({
    ...data,
    code: data.code.toUpperCase(),
    createdBy: userId,
  });
  return promo;
};

export const getPromoById = async (id) => {
  const promo = await PromoCode.findById(id).lean();

  if (!promo) {
    throw new AppError('Promo code not found', httpStatus.NOT_FOUND);
  }

  return promo;
};

export const updatePromo = async (id, data) => {
  const update = { ...data };
  if (update.code) {
    update.code = update.code.toUpperCase();
  }

  const promo = await PromoCode.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });

  if (!promo) {
    throw new AppError('Promo code not found', httpStatus.NOT_FOUND);
  }

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
