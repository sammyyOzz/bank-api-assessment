import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

export const env: string | undefined = process.env.NODE_ENV;
export const port: string | undefined = process.env.PORT;
export const config = {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || '',
  },
  mongodb: {
    url: process.env.MONGODB_URL || '',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  jwt: {
    secret: process.env.JWT_SECRET || '',
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '30m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
};
