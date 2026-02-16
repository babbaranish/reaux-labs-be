import httpStatus from 'http-status';
import { sendError } from '../shared/response.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    return sendError(res, 'Validation error', httpStatus.BAD_REQUEST, result.error.flatten());
  }

  // Apply transformed/coerced values back to req
  Object.assign(req, result.data);
  next();
};
