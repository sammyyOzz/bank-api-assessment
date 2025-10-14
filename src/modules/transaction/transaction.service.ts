import mongoose from 'mongoose';
import transactionRepository from './transaction.repository';
import { TransactionStatus, TransactionType } from './transaction.types';
import { accountRepository } from '../accounts/account.repository';
import ApiError from '../../utils/api-error';
import { AccountStatus } from '../accounts/account.types';

class TransactionService {
  async initiateTransfer(
    userId: string,
    transferData: {
      toAccountNumber: string;
      amount: number;
      description?: string;
    },
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const fromAccount = await accountRepository.findByUserId(userId, session);
      if (!fromAccount) {
        throw ApiError.notFound('Sender account not found');
      }

      if (fromAccount.status !== AccountStatus.ACTIVE) {
        throw ApiError.badRequest('Sender account is not active');
      }

      const toAccount = await accountRepository.findByAccountNumber(
        transferData.toAccountNumber,
        session,
      );
      if (!toAccount) {
        throw ApiError.notFound('Recipient account not found');
      }

      if (toAccount.status !== AccountStatus.ACTIVE) {
        throw ApiError.badRequest('Recipient account is not active');
      }

      if (fromAccount._id.equals(toAccount._id)) {
        throw ApiError.badRequest('Cannot transfer to your own account');
      }

      if (fromAccount.balance < transferData.amount) {
        throw ApiError.badRequest('Insufficient balance');
      }

      fromAccount.balance -= transferData.amount;
      toAccount.balance += transferData.amount;

      await Promise.all([fromAccount.save({ session }), toAccount.save({ session })]);

      const transaction = await transactionRepository.createTransaction({
        fromAccountId: String(fromAccount._id),
        toAccountId: String(toAccount._id),
        type: TransactionType.TRANSFER,
        amount: transferData.amount,
        currency: fromAccount.currency,
        description: transferData.description,
        status: TransactionStatus.COMPLETED,
        initiatedBy: userId,
      });

      await session.commitTransaction();

      return await transactionRepository.findById(transaction._id.toString());
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getMyTransactions(userId: string, page = 1, limit = 10) {
    const account = await accountRepository.findByUserId(userId);
    if (!account) {
      throw ApiError.notFound('Account not found');
    }

    const skip = (page - 1) * limit;

    const filter = {
      $or: [{ fromAccountId: account._id }, { toAccountId: account._id }],
    };

    const [transactions, total] = await Promise.all([
      transactionRepository.findAll(filter).then((all) => all.slice(skip, skip + limit)),
      transactionRepository.count(filter),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getAllTransactions(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      transactionRepository.findAll().then((all) => all.slice(skip, skip + limit)),
      transactionRepository.count(),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

export default new TransactionService();
