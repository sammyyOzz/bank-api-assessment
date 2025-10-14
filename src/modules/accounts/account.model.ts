import mongoose, { Schema } from 'mongoose';
import { AccountStatus, IAccountDocument } from './account.types';

const accountSchema = new Schema<IAccountDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
  },
);

const Account = mongoose.model<IAccountDocument>('Account', accountSchema);

export default Account;
