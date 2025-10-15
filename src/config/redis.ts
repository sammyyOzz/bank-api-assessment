import { createClient, RedisClientType } from 'redis';
import { config } from './config';
import logger from '../utils/logger';

let client: RedisClientType | null = null;

export const connectRedis = async (): Promise<RedisClientType> => {
  if (client?.isOpen) {
    return client;
  }

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

    client.on('disconnect', () => {
      logger.warn('Redis Client Disconnected');
    });

    await client.connect();
    logger.info('Redis connection established successfully');

    return client;
  } catch (error) {
    logger.error('Redis connection failed:', error);
    client = null;
    throw error;
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!client?.isOpen) {
    throw new Error('Redis client is not connected. Call connectRedis() first.');
  }
  return client;
};

export const disconnectRedis = async (): Promise<void> => {
  if (client?.isOpen) {
    await client.quit();
    client = null;
    logger.info('Redis client disconnected');
  }
};
