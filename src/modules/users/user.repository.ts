import User from '../users/user.model';
import { IUser, IUserDocument } from './user.types';

class UserRepository {
  async createUser(userData: Partial<IUser>): Promise<IUserDocument> {
    return await User.create(userData);
  }

  async findByEmail(email: string): Promise<IUserDocument | null> {
    return await User.findOne({ email });
  }

  async findById(userId: string): Promise<IUserDocument | null> {
    return await User.findById(userId);
  }

  async deleteUser(userId: string): Promise<IUserDocument | null> {
    return await User.findByIdAndDelete(userId);
  }

  async getAllUsers(): Promise<IUserDocument[]> {
    return await User.find();
  }
}

export const userRepository = new UserRepository();
export default userRepository;
