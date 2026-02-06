import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { User } from '../modules/user/user.model.js';
import { sendError } from '../shared/response.js';
import env from '../config/env.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, 'No authentication token provided', httpStatus.UNAUTHORIZED);
    }

    const token = authHeader.substring(7);

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET || 'default-dev-secret');
    } catch (error) {
      return sendError(res, 'Invalid or expired token', httpStatus.UNAUTHORIZED);
    }

    const user = await User.findById(decoded.userId)
      .select('email name role status gymId')
      .lean();
    if (!user) {
      return sendError(res, 'User not found', httpStatus.UNAUTHORIZED);
    }

    if (user.status === 'disabled') {
      return sendError(res, 'Account is disabled', httpStatus.FORBIDDEN);
    }

    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      gymId: user.gymId,
    };

    next();
  } catch (error) {
    return sendError(res, 'Authentication failed', httpStatus.UNAUTHORIZED);
  }
};
