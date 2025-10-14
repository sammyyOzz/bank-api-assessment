import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { transactionController } from './transaction.controller';
import { initiateTransactionSchema } from './transaction.validation';
import authorize from '../../middleware/rbac.middleware';
import { UserRoles } from '../users/user.types';

const router = Router();

router.use(authenticate);

router.post(
  '/transfer',
  validate(initiateTransactionSchema),
  transactionController.initiateTransfer,
);
router.get('/me', transactionController.getMyTransactions);

// admin
router.get('/', authorize([UserRoles.ADMIN]), transactionController.getAllTransactions);

export default router;
