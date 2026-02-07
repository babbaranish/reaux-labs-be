import { Product } from './product.model.js';
import { paginate } from '../../shared/pagination.js';
import { findByIdOrFail, updateByIdOrFail } from '../../shared/crudOperations.js';

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
  return findByIdOrFail(Product, id);
};

export const updateProduct = async (id, data) => {
  return updateByIdOrFail(Product, id, data);
};
