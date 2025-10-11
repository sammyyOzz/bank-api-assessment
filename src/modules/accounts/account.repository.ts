import Account from './account.model';
import { IAccount, IAccountDocument } from './account.types';
import { FilterQuery, UpdateQuery } from 'mongoose';

class AccountRepository {
  async create(accountData: Partial<IAccount>): Promise<IAccountDocument> {
    const account = new Account(accountData);
    return await account.save();
  }

  async findById(id: string): Promise<IAccountDocument | null> {
    return await Account.findById(id);
  }

  async findByUserId(userId: string): Promise<IAccountDocument | null> {
    return await Account.findOne({ userId });
  }

  async findByAccountNumber(accountNumber: string): Promise<IAccountDocument | null> {
    return await Account.findOne({ accountNumber });
  }

  async findAll(
    filter: FilterQuery<IAccount | IAccountDocument> = {},
  ): Promise<IAccountDocument[]> {
    return await Account.find(filter);
  }

  async updateById(
    id: string,
    updateData: UpdateQuery<IAccountDocument>,
  ): Promise<IAccountDocument | null> {
    return await Account.findByIdAndUpdate(id, updateData, { new: true });
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
