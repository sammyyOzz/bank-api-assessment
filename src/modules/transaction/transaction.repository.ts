import { IFindOptions } from '../../types/pagination.types';
import Transaction from './transaction.model';
import { ITransaction, ITransactionDocument, TransactionStatus } from './transaction.types';
import { FilterQuery } from 'mongoose';

class TransactionRepository {
  async createTransaction(data: ITransaction): Promise<ITransactionDocument> {
    const transaction = new Transaction(data);
    return await transaction.save();
  }

  async findById(id: string): Promise<ITransactionDocument | null> {
    return await Transaction.findById(id)
      .populate('fromAccountId')
      .populate('toAccountId')
      .populate('initiatedBy')
      .exec();
  }

  async findOne(filter: FilterQuery<ITransactionDocument>): Promise<ITransactionDocument | null> {
    return await Transaction.findOne(filter).exec();
  }

  async findAll(filter: any = {}, options: IFindOptions = {}): Promise<any[]> {
    const { skip = 0, limit, sort = { createdAt: -1 } } = options;

    let query = Transaction.find(filter).sort(sort);

    if (skip) query = query.skip(skip);
    if (limit) query = query.limit(limit);

    return await query
      .populate('fromAccountId', 'accountNumber accountName')
      .populate('toAccountId', 'accountNumber accountName')
      .populate('initiatedBy', 'firstName lastName email')
      .lean()
      .exec();
  }

  async deleteById(id: string): Promise<ITransactionDocument | null> {
    return await Transaction.findByIdAndDelete(id).exec();
  }

  async findByReference(reference: string): Promise<ITransactionDocument | null> {
    return await Transaction.findOne({ transactionReference: reference }).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return await Transaction.countDocuments(filter).exec();
  }

  async findPaginated(
    filter: any,
    skip: number,
    limit: number,
  ): Promise<{ data: any[]; total: number }> {
    const data = await this.findAll(filter, { skip, limit, sort: { createdAt: -1 } });
    const total = await this.count(filter);

    return { data, total };
  }
}

export default new TransactionRepository();
