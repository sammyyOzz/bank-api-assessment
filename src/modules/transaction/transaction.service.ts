import mongoose from 'mongoose';
import transactionRepository from './transaction.repository';
import { TransactionStatus, TransactionType } from './transaction.types';
import { accountRepository } from '../accounts/account.repository';
import ApiError from '../../utils/api-error';
import { AccountStatus } from '../accounts/account.types';
import { IPaginationParams } from '../../types/pagination.types';
import { PaginationHelper } from '../../utils/pagination';

class TransactionService {
  async initiateTransfer(
    userId: string,
    transferData: {
      fromAccountNumber: string;
      toAccountNumber: string;
      amount: number;
      description?: string;
    },
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const fromAccount = await accountRepository.findByAccountNumber(
        transferData.fromAccountNumber,
        session,
      );
      if (!fromAccount) {
        throw ApiError.notFound('Sender account not found');
      }

      if (fromAccount.userId.toString() !== userId) {
        throw ApiError.unauthorized('Can only transfer from your own account');
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

  async withdrawFunds(
    userId: string,
    withdrawalData: {
      accountNumber: string;
      amount: number;
      description?: string;
    },
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const account = await accountRepository.findByUserId(userId, session);
      if (!account) {
        throw ApiError.notFound('Account not found');
      }

      if (account.status !== AccountStatus.ACTIVE) {
        throw ApiError.badRequest('Account is not active');
      }

      if (account.accountNumber !== withdrawalData.accountNumber) {
        throw ApiError.badRequest('Can only withdraw from your own account');
      }

      if (account.balance < withdrawalData.amount) {
        throw ApiError.badRequest('Insufficient balance');
      }

      account.balance -= withdrawalData.amount;
      await account.save({ session });

      const transaction = await transactionRepository.createTransaction({
        fromAccountId: String(account._id),
        type: TransactionType.WITHDRAWAL,
        amount: withdrawalData.amount,
        currency: account.currency,
        description: withdrawalData.description,
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

  async depositFunds(
    userId: string,
    depositData: {
      accountNumber: string;
      amount: number;
      description?: string;
    },
  ) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const account = await accountRepository.findByUserId(userId, session);
      if (!account) {
        throw ApiError.notFound('Account not found');
      }

      if (account.status !== AccountStatus.ACTIVE) {
        throw ApiError.badRequest('Account is not active');
      }

      account.balance += depositData.amount;
      await account.save({ session });

      const transaction = await transactionRepository.createTransaction({
        toAccountId: String(account._id),
        type: TransactionType.DEPOSIT,
        amount: depositData.amount,
        currency: account.currency,
        description: depositData.description,
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

  async getMyTransactions(userId: string, params: IPaginationParams) {
    const account = await accountRepository.findByUserId(userId);
    if (!account) {
      throw ApiError.notFound('Account not found');
    }

    const { page, limit, skip } = PaginationHelper.validateAndNormalize(params);

    const filter = {
      $or: [{ fromAccountId: account._id }, { toAccountId: account._id }],
    };

    const { data, total } = await transactionRepository.findPaginated(filter, skip, limit);

    return PaginationHelper.formatResponse(data, page, limit, total);
  }

  async getAllTransactions(params: IPaginationParams) {
    const { page, limit, skip } = PaginationHelper.validateAndNormalize(params);

    const { data, total } = await transactionRepository.findPaginated({}, skip, limit);

    return PaginationHelper.formatResponse(data, page, limit, total);
  }
}

export default new TransactionService();
