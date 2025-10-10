import logger from '../utils/logger';
import ApiError from '../utils/api-error';
import type { Request as ExpressRequest, Response as ExpressResponse } from 'express';

const errorMiddleware = (
  err: Error,
  req: ExpressRequest,
  res: ExpressResponse,
  // next: NextFunction,
) => {
  let error: ApiError;

  if (err instanceof ApiError) {
    error = err;
  } else {
    error = new ApiError(500, err.message, false, err.stack);
  }

  // mongoose validation error
  if (err.name === 'ValidationError' && 'errors' in err) {
    const message = Object.values((err as any).errors)
      .map((e: any) => e.message)
      .join(', ');
    error = ApiError.badRequest(message);
  }

  // mongoose duplicate key error
  if ('code' in err && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0];
    error = ApiError.conflict(`${field} already exists`);
  }

  // mongoose cast error
  if (err.name === 'CastError') {
    error = ApiError.badRequest('Invalid ID format');
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = ApiError.unauthorized('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = ApiError.unauthorized('Token expired');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  logger.error({
    statusCode,
    message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorMiddleware;
