import httpStatus from 'http-status';

export const sendSuccess = (res, data = null, statusCode = httpStatus.OK, message = null) => {
  const response = {
    success: true,
    ...(message && { message }),
    ...(data && { data }),
  };
  return res.status(statusCode).json(response);
};

export const sendError = (res, message, statusCode = httpStatus.BAD_REQUEST, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(response);
};

export const sendPaginated = (res, data, pagination, statusCode = httpStatus.OK) => {
  return res.status(statusCode).json({
    success: true,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      pages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};
