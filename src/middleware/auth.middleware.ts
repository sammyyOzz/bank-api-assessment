import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import ApiError from '../utils/api-error';
import tokenManager from '../utils/token-manager';
import { UserRoles } from '../modules/users/user.types';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRoles;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = (
  req: ExpressRequest,
  res: ExpressResponse,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('No token provided'));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(ApiError.unauthorized('No token provided'));
    }

    const decoded = tokenManager.verifyToken(token) as AuthenticatedUser;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Token expired'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Invalid token'));
    }
    if (error.message === 'Invalid or expired token') {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }

    return next(error);
  }
};
