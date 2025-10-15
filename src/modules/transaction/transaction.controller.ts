import { Request, Response } from 'express';
import asyncHandler from '../../utils/async-handler';
import transactionService from './transaction.service';

class TransactionController {
  initiateTransfer = asyncHandler(async (req: Request, res: Response) => {
    const transaction = await transactionService.initiateTransfer(req.user!.userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Transaction completed successfully',
      data: { transaction },
    });
  });

  withdrawFunds = asyncHandler(async (req: Request, res: Response) => {
    const transaction = await transactionService.withdrawFunds(req.user!.userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Withdrawal completed successfully',
      data: { transaction },
    });
  });

  depositFunds = asyncHandler(async (req: Request, res: Response) => {
    const transaction = await transactionService.depositFunds(req.user!.userId, req.body);

    res.status(201).json({
      success: true,
      message: 'Deposit completed successfully',
      data: { transaction },
    });
  });

  getMyTransactions = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await transactionService.getMyTransactions(req.user!.userId, { page, limit });

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  getAllTransactions = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await transactionService.getAllTransactions({ page, limit });

    res.status(200).json({
      success: true,
      data: result,
    });
  });
}

export const transactionController = new TransactionController();
