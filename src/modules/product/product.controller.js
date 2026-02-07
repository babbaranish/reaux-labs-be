import httpStatus from 'http-status';
import * as productService from './product.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

export const create = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user.id);
  return sendSuccess(res, product, httpStatus.CREATED, 'Product created');
});

export const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await productService.getProducts(req.query);
  return sendPaginated(res, data, pagination);
});

export const getById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return sendSuccess(res, product);
});

export const update = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  return sendSuccess(res, product, httpStatus.OK, 'Product updated');
});
