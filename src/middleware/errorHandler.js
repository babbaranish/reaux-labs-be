import httpStatus from 'http-status';
import env from '../config/env.js';

export const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'MulterError') {
    statusCode = httpStatus.BAD_REQUEST;
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'Image is too large. Please use a photo under 15MB.'
        : `Upload error: ${err.message}`;
  } else if (err.name === 'ValidationError') {
    statusCode = httpStatus.BAD_REQUEST;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.code === 11000) {
    statusCode = httpStatus.CONFLICT;
    const field = Object.keys(err.keyPattern || {})[0];
    message = `Duplicate value for field: ${field}`;
  } else if (err.name === 'CastError') {
    statusCode = httpStatus.BAD_REQUEST;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = httpStatus.UNAUTHORIZED;
    message = 'Token expired';
  }

  if (env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFound = (req, res, _next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};
