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

export const getProducts = async (query, userRole) => {
  const filter = { isActive: true };

  // Visibility filtering by role
  if (userRole === 'superadmin') {
    // superadmin sees all products
  } else if (userRole === 'admin') {
    filter.visibility = { $in: ['all', 'admin'] };
  } else if (userRole === 'user') {
    filter.visibility = { $in: ['all', 'user'] };
  } else {
    // unauthenticated — only public products
    filter.visibility = 'all';
  }

  if (query.category) {
    // Match case-insensitively: a filter tab must not miss a product that was
    // saved with different casing.
    const escaped = query.category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.category = new RegExp(`^${escaped}$`, 'i');
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
