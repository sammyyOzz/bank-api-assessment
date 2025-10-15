import logger from '../utils/logger';
import ApiError from '../utils/api-error';
import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { env } from '../config/config';

const errorMiddleware = (
  err: any,
  req: ExpressRequest,
  res: ExpressResponse,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  res.setHeader('Content-Type', 'application/json');

  let error: ApiError;

  if (err instanceof ApiError) {
    error = err;
  }
  // Joi validation error
  else if (err.name === 'ValidationError' && err.isJoi) {
    const message =
      err.details?.map((detail: any) => detail.message.replace(/"/g, '')).join(', ') || err.message;
    error = ApiError.badRequest(message);
  }
  // Mongoose validation error
  else if (err.name === 'ValidationError' && 'errors' in err) {
    const message = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(', ');
    error = ApiError.badRequest(message);
  }
  // Mongoose duplicate key error
  else if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];
    error = ApiError.conflict(`${field} already exists`);
  } else if (err.name === 'CastError') {
    error = ApiError.badRequest('Invalid ID format');
  } else if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  } else if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired');
  } else {
    error = new ApiError(
      err.statusCode || 500,
      err.message || 'Internal Server Error',
      false,
      err.stack,
    );
  }

  logger.error({
    statusCode: error.statusCode,
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
    isOperational: error.isOperational,
  });

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    ...(env === 'development' && { stack: error.stack }),
  });
};

export default errorMiddleware;
