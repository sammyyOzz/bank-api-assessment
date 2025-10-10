import type { RedisClientType } from 'redis';
import { createClient } from 'redis';
import { config } from '../config/config';

let redisClient: RedisClientType;
let isReady: boolean;

const cacheOptions = {
  url: config.redis.url,
};

async function createRedisClient(): Promise<RedisClientType> {
  redisClient = createClient({
    ...cacheOptions,
  });

  redisClient.on('error', (err) => console.error(`Redis Error: ${err}`));
  redisClient.on('connect', () => console.info('Redis connected'));
  redisClient.on('reconnecting', () => console.info('Redis reconnecting'));
  redisClient.on('ready', () => {
    isReady = true;
    console.info('Redis ready!');
  });

  await redisClient.connect();

  return redisClient;
}

async function getRedisClient(): Promise<RedisClientType> {
  if (!isReady) {
    redisClient = await createRedisClient();
  }

  return redisClient;
}

export async function getFromCache(key: string): Promise<string | null> {
  const client = await getRedisClient();
  const value = await client.get(key);
  return value;
}

export async function setToCache(key: string, value: string): Promise<void | string | null> {
  const client = await getRedisClient();
  return client.set(key, value) as unknown as Promise<void | string | null>;
}
