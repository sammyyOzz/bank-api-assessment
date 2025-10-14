import { UserRoles } from '../modules/users/user.types';
import ApiError from '../utils/api-error';
import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';

const authorize = (allowedRoles: UserRoles[]) => {
  return (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to access this resource'));
    }

    next();
  };
};

export default authorize;
