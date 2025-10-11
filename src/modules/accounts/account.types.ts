import mongoose from 'mongoose';

export enum AccountStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CLOSED = 'closed',
}

export interface IAccount {
  userId: string | mongoose.Schema.Types.ObjectId;
  accountNumber: string;
  accountName: string;
  balance: number;
  currency: string;
  status: AccountStatus;
}

export interface IAccountDocument extends IAccount, Document {}
