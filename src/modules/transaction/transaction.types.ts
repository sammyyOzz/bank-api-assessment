import mongoose from 'mongoose';
import { IBaseDocument } from '../../types/mongoose.types';

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum TransactionType {
  TRANSFER = 'transfer',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  PAYMENT = 'payment',
  REFUND = 'refund',
}

export interface ITransaction {
  fromAccountId?: string | mongoose.Schema.Types.ObjectId;
  toAccountId?: string | mongoose.Schema.Types.ObjectId;
  type: TransactionType;
  amount: number;
  currency: string;
  description?: string;
  status: TransactionStatus;
  initiatedBy: string | mongoose.Schema.Types.ObjectId;
  transactionReference?: string;
}

export interface ITransactionDocument extends ITransaction, IBaseDocument {}
