import httpStatus from 'http-status';
import * as productService from './product.service.js';
import { sendSuccess, sendPaginated } from '../../shared/response.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

// Multipart delivers arrays as a JSON string (or a bare string for one value).
const parseList = (value) => {
  if (value == null) return undefined;
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value !== 'string') return undefined;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    // Not JSON — treat it as a single value.
  }
  return value ? [value] : [];
};

export const create = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.files?.length) {
    data.images = req.files.map((f) => f.path);
  }
  const flavours = parseList(data.flavours);
  if (flavours) {
    data.flavours = flavours;
  }
  const product = await productService.createProduct(data, req.user.id);
  return sendSuccess(res, product, httpStatus.CREATED, 'Product created');
});

export const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await productService.getProducts(req.query, req.user?.role);
  return sendPaginated(res, data, pagination);
});

export const getById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return sendSuccess(res, product);
});

export const update = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  const updatedFlavours = parseList(data.flavours);
  if (updatedFlavours) {
    data.flavours = updatedFlavours;
  }
  if (req.files?.length) {
    // Merge existing images (sent from frontend) with newly uploaded ones
    const existing = Array.isArray(data.existingImages)
      ? data.existingImages
      : data.existingImages
        ? [data.existingImages]
        : [];
    const uploaded = req.files.map((f) => f.path);
    data.images = [...existing, ...uploaded];
    delete data.existingImages;
  }
  const product = await productService.updateProduct(req.params.id, data);
  return sendSuccess(res, product, httpStatus.OK, 'Product updated');
});
