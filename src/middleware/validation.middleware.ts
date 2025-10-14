import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';
import { ObjectSchema } from 'joi';
import ApiError from '../utils/api-error';

export const validate =
  (schema: ObjectSchema) =>
  (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(ApiError.badRequest(errorMessage));
    }

    next();
  };
