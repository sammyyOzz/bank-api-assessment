import express from 'express';
import rateLimiter from '../middleware/rate-limiter.middleware';
import v1Routes from './v1';

const router = express.Router();

router.use(rateLimiter);

router.use('/v1', v1Routes);

export default router;
