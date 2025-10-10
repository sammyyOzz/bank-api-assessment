import app from './app';
import { env, port } from './config/config';
import logger from './utils/logger';

app.listen(port, (): void => {
  logger.info(`[${env}] Listening to port ${port}`);
});
