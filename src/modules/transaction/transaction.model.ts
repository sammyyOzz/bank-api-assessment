import mongoose, { Schema } from 'mongoose';
import { ITransactionDocument, TransactionStatus, TransactionType } from './transaction.types';
import { transactionRefGenerator } from '../../utils/number-generator';

const transactionSchema = new Schema<ITransactionDocument>(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatus),
      default: TransactionStatus.PENDING,
    },
    initiatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transactionReference: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

transactionSchema.pre('save', function (next) {
  if (!this.transactionReference) {
    this.transactionReference = transactionRefGenerator.generate();
  }
  next();
});

const Transfer = mongoose.model<ITransactionDocument>('Transaction', transactionSchema);
export default Transfer;
