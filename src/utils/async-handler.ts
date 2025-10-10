import type { Request as ExpressRequest, Response as ExpressResponse, NextFunction } from 'express';

const asyncHandler =
  (fn: any) => (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
