import httpStatus from 'http-status';
import { Product } from './product.model.js';
import { paginate } from '../../shared/pagination.js';
import { findByIdOrFail, updateByIdOrFail } from '../../shared/crudOperations.js';
import { AppError } from '../../shared/appError.js';

// Which visibility values a given role may see (mirrors the list endpoint).
const visibleFor = (userRole) => {
  if (userRole === 'superadmin') return null; // all
  if (userRole === 'admin') return ['all', 'admin'];
  if (userRole === 'user') return ['all', 'user'];
  return ['all']; // unauthenticated
};

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

export const getProductById = async (id, userRole) => {
  const product = await findByIdOrFail(Product, id);
  // Enforce the same visibility rules as the list — the bare by-id read let an
  // anonymous caller fetch admin-only SKUs (and their wholesale pricing).
  const allowed = visibleFor(userRole);
  if (product.isActive === false || (allowed && !allowed.includes(product.visibility))) {
    throw new AppError('Product not found', httpStatus.NOT_FOUND);
  }
  return product;
};

export const updateProduct = async (id, data) => {
  return updateByIdOrFail(Product, id, data);
};
