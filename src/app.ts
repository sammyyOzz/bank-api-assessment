import express, { Request, Response, NextFunction } from 'express';
import { getFromCache, setToCache } from './services/cache';

const app = express();

// Middleware function to handle caching
const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cacheKey = req.originalUrl;
    const cachedData = await getFromCache(cacheKey);

    if (cachedData !== null) {
      console.log('Retrieved data from Redis cache:', cachedData);
      return res.send(cachedData);
    }
  } catch (error) {
    console.error('Error accessing Redis cache:', error);
  }
  // If data is not found in cache, continue to the next middleware/route
  return next();
};

// Apply the cache middleware to specific routes
app.get('/', cacheMiddleware, async (req: Request, res: Response) => {
  const homePageMessage = 'Home page is working :)';

  try {
    // If the control reaches here, it means the data is not found in cache
    await setToCache(req.originalUrl, homePageMessage);
    console.log('Set data in Redis cache:', homePageMessage);
  } catch (error) {
    console.error('Error accessing Redis cache:', error);
  } finally {
    return res.send(homePageMessage);
  }
});

export default app;
