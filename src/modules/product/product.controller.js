import httpStatus from 'http-status';
import * as productService from './product.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';

export const create = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body, req.user.id);
    return sendSuccess(res, product, httpStatus.CREATED, 'Product created');
  } catch (error) {
    next(error);
  }
};

export const list = async (req, res, next) => {
  try {
    const { data, pagination } = await productService.getProducts(req.query);
    return sendPaginated(res, data, pagination);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    return sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    return sendSuccess(res, product, httpStatus.OK, 'Product updated');
  } catch (error) {
    next(error);
  }
};
