import { accountNumberGenerator } from '../../utils/number-generator';
import Account from './account.model';
import { IAccount, IAccountDocument } from './account.types';
import { FilterQuery, UpdateQuery, ClientSession } from 'mongoose';

class AccountRepository {
  async create(data: Partial<IAccount>): Promise<IAccountDocument> {
    if (!data.accountNumber) {
      data.accountNumber = accountNumberGenerator.generate();
    }
    const account = new Account(data);
    return await account.save();
  }

  async findById(id: string): Promise<IAccountDocument | null> {
    return await Account.findById(id);
  }

  async findByUserId(userId: string, session?: ClientSession): Promise<IAccountDocument | null> {
    return await Account.findOne({ userId }).session(session || null);
  }

  async findByAccountNumber(
    accountNumber: string,
    session?: ClientSession,
  ): Promise<IAccountDocument | null> {
    return await Account.findOne({ accountNumber }).session(session || null);
  }

  async findAll(
    filter: FilterQuery<IAccount | IAccountDocument> = {},
  ): Promise<IAccountDocument[]> {
    return await Account.find(filter);
  }

  async deleteById(id: string): Promise<IAccountDocument | null> {
    return await Account.findByIdAndDelete(id);
  }

  async updateBalance(accountId: string, amount: number): Promise<IAccountDocument | null> {
    const account = await Account.findById(accountId);
    if (!account) return null;

    account.balance += amount;
    return await account.save();
  }
}

export const accountRepository = new AccountRepository();
