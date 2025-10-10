import app from './app';
import { env, port } from './config/config';

app.listen(port, (): void => {
  console.log(`[${env}] Listening to port ${port}`);
});
