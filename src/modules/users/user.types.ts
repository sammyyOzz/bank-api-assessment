import { Document } from 'mongoose';

export enum UserRoles {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoles;
  isActive: boolean;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}
