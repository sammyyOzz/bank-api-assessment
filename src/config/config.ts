import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

export const env: string | undefined = process.env.NODE_ENV;
export const port: string | undefined = process.env.PORT;
export const config = {
  redis: {
    url: process.env.REDIS_URL,
  },
};
