import { createClient, RedisClientType } from 'redis';
import { config } from './config';
import logger from '../utils/logger';

let client: RedisClientType | null = null;

export const connectRedis = async (): Promise<RedisClientType> => {
  try {
    client = createClient({
      socket: {
        host: config.redis.host,
        port: config.redis.port,
      },
      password: config.redis.password || undefined,
    });

    client.on('error', (err: Error) => {
      logger.error('Redis Client Error:', err);
    });

    client.on('connect', () => {
      logger.info('Redis Client Connected');
    });

    await client.connect();
    return client;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    throw error;
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!client) {
    throw new Error('Redis client not initialized');
  }
  return client;
};
