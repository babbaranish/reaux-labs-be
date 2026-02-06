import httpStatus from 'http-status';
import { Product } from './product.model.js';
import { AppError } from '../../shared/appError.js';
import { paginate } from '../../shared/pagination.js';

export const createProduct = async (data, userId) => {
  const product = await Product.create({
    ...data,
    createdBy: userId,
  });
  return product;
};

export const getProducts = async (query) => {
  const filter = { isActive: true };

  if (query.category) {
    filter.category = query.category;
  }

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const result = await paginate(Product, filter, {
    page: query.page,
    limit: query.limit,
  });

  return result;
};

export const getProductById = async (id) => {
  const product = await Product.findById(id).lean();
  if (!product) {
    throw new AppError('Product not found', httpStatus.NOT_FOUND);
  }
  return product;
};

export const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new AppError('Product not found', httpStatus.NOT_FOUND);
  }
  return product;
};
