import express from 'express';
import rateLimiter from '../middleware/rate-limiter.middleware';

const router = express.Router();

router.use(rateLimiter);

// router.use('/auth', authRoutes);
// router.use('/accounts', accountRoutes);
// router.use('/transfers', transferRoutes);

export default router;
