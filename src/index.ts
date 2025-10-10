import app from './app';
import { env, port } from './config/config';
import { connectDB } from './config/database';
import { connectRedis } from './config/redis';
import logger from './utils/logger';
import http from 'http';

const server = http.createServer(app);

async function startServer() {
  try {
    await connectDB();

    await connectRedis();

    server.listen(port, (): void => {
      logger.info(`[${env}] Listening to port ${port}`);
    });

    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
