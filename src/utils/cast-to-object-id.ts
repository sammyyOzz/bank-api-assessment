import { isValidObjectId, Types } from 'mongoose';
import ApiError from './api-error';

export function castToObjectId(idString: string): Types.ObjectId {
  const isValidId = isValidObjectId(idString);
  if (!isValidId) {
    throw ApiError.badRequest('Invalid object ID');
  }
  return new Types.ObjectId(idString);
}
