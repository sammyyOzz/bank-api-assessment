import Transaction from './transaction.model';
import { ITransaction, ITransactionDocument, TransactionStatus } from './transaction.types';
import { FilterQuery, UpdateQuery } from 'mongoose';

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

  async findAll(filter: FilterQuery<ITransactionDocument> = {}): Promise<ITransactionDocument[]> {
    return await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .populate('fromAccountId')
      .populate('toAccountId')
      .populate('initiatedBy')
      .exec();
  }

  // async updateTransaction(
  //   id: string,
  //   update: UpdateQuery<ITransactionDocument>
  // ): Promise<ITransactionDocument | null> {
  //   return await Transaction.findByIdAndUpdate(id, update, { new: true }).exec();
  // }

  // async updateStatus(id: string, status: TransactionStatus): Promise<ITransactionDocument | null> {
  //   return await this.updateTransaction(id, { status });
  // }

  async deleteById(id: string): Promise<ITransactionDocument | null> {
    return await Transaction.findByIdAndDelete(id).exec();
  }

  async findByReference(reference: string): Promise<ITransactionDocument | null> {
    return await Transaction.findOne({ transactionReference: reference }).exec();
  }

  async count(filter: FilterQuery<ITransactionDocument> = {}): Promise<number> {
    return await Transaction.countDocuments(filter).exec();
  }
}

export default new TransactionRepository();
