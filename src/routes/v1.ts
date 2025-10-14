import express from 'express';
import authRoutes from '../modules/auth/auth.routes';
import transactionRoutes from '../modules/transaction/transaction.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);

export default router;
