import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

export const env: string | undefined = process.env.NODE_ENV;
export const port: string | undefined = process.env.PORT;
export const config = {
  redis: {
    url: process.env.REDIS_URL || '',
  },
  mongodb: {
    url: process.env.MONGODB_URL || '',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
};
