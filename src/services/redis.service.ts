import { RedisClientType } from 'redis';
import { getRedisClient } from '../config/redis';
import logger from '../utils/logger';

class RedisService {
  private client: RedisClientType | null = null;

  private getClient(): RedisClientType {
    if (!this.client) {
      this.client = getRedisClient();
    }
    return this.client;
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      const client = this.getClient();

      if (ttl) {
        await client.setEx(key, ttl, stringValue);
      } else {
        await client.set(key, stringValue);
      }
    } catch (error) {
      logger.error('Redis SET error:', error);
      throw error;
    }
  }

  async get<T = any>(key: string): Promise<T | string | null> {
    try {
      const client = this.getClient();
      const value = await client.get(key);

      if (!value) return null;

      try {
        return JSON.parse(value) as T;
      } catch {
        return value;
      }
    } catch (error) {
      logger.error('Redis GET error:', error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const client = this.getClient();
      await client.del(key);
    } catch (error) {
      logger.error('Redis DELETE error:', error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const client = this.getClient();
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS error:', error);
      throw error;
    }
  }

  async setRefreshToken(userId: string, refreshToken: string, ttl: number): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.set(key, refreshToken, ttl);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    const key = `refresh_token:${userId}`;
    return this.get<string>(key);
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.delete(key);
  }

  async deletePattern(pattern: string): Promise<void> {
    try {
      const client = this.getClient();
      const keys = await client.keys(pattern);

      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      logger.error('Redis DELETE PATTERN error:', error);
      throw error;
    }
  }
}

export const redisService = new RedisService();
export default redisService;
