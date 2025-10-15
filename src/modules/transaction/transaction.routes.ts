import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { transactionController } from './transaction.controller';
import {
  depositFundsSchema,
  transferFundsSchema,
  withdrawFundsSchema,
} from './transaction.validation';
import authorize from '../../middleware/rbac.middleware';
import { UserRoles } from '../users/user.types';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /v1/transactions/transfer:
 *   post:
 *     summary: Transfer funds between accounts
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fromAccountNumber
 *               - toAccountNumber
 *               - amount
 *             properties:
 *               fromAccountNumber:
 *                 type: string
 *                 example: "1234567890"
 *               toAccountNumber:
 *                 type: string
 *                 example: "9876543210"
 *               amount:
 *                 type: number
 *                 example: 500.00
 *               description:
 *                 type: string
 *                 example: Payment for services
 *     responses:
 *       201:
 *         description: Transfer completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Transfer completed successfully
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid input or insufficient balance
 *       401:
 *         description: Unauthorized
 */
router.post('/transfer', validate(transferFundsSchema), transactionController.initiateTransfer);

/**
 * @swagger
 * /v1/transactions/withdraw:
 *   post:
 *     summary: Withdraw funds from your account
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - amount
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "1234567890"
 *               amount:
 *                 type: number
 *                 example: 200.00
 *               description:
 *                 type: string
 *                 example: ATM cash withdrawal
 *     responses:
 *       201:
 *         description: Withdrawal successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Withdrawal successful
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid input or insufficient balance
 *       401:
 *         description: Unauthorized
 */
router.post('/withdraw', validate(withdrawFundsSchema), transactionController.withdrawFunds);

/**
 * @swagger
 * /v1/transactions/deposit:
 *   post:
 *     summary: Deposit funds into your account
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountNumber
 *               - amount
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 example: "1234567890"
 *               amount:
 *                 type: number
 *                 example: 1000.00
 *               description:
 *                 type: string
 *                 example: Salary deposit
 *     responses:
 *       201:
 *         description: Deposit successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Deposit successful
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/deposit', validate(depositFundsSchema), transactionController.depositFunds);

/**
 * @swagger
 * /v1/transactions/me:
 *   get:
 *     summary: Get all transactions for the logged-in user
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of user transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 */
router.get('/me', transactionController.getMyTransactions);

/**
 * @swagger
 * /v1/transactions/all:
 *   get:
 *     summary: Get all transactions (Admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: List of all transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Transaction'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admins only
 */
router.get('/all', authorize([UserRoles.ADMIN]), transactionController.getAllTransactions);

export default router;
