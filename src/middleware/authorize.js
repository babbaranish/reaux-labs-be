import httpStatus from 'http-status';
import { sendError } from '../shared/response.js';

export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return sendError(res, 'Authentication required', httpStatus.UNAUTHORIZED);
  }

  if (!allowedRoles.includes(req.user.role)) {
    return sendError(res, 'Insufficient permissions', httpStatus.FORBIDDEN);
  }

  next();
};
