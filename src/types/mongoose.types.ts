import mongoose, { Document as MongooseDocument } from 'mongoose';

export interface IBaseDocument extends MongooseDocument {
  _id: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
