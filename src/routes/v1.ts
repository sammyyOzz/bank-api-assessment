import express from 'express';
import authRoutes from '../modules/auth/auth.routes';
import transactionRoutes from '../modules/transaction/transaction.routes';
import accountRoutes from '../modules/accounts/account.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/accounts', accountRoutes);

export default router;
