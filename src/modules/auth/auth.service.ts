import tokenManager from '../../utils/token-manager';
import ApiError from '../../utils/api-error';
import redisService from '../../services/redis.service';
import { IUser } from '../users/user.types';
import userRepository from '../users/user.repository';
import { accountRepository } from '../accounts/account.repository';
import { omit } from '../../utils/omit';

class AuthService {
  async signup(userData: Partial<IUser>) {
    const existingUser = await userRepository.findByEmail(userData.email!);
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    const user = await userRepository.createUser(userData);

    const account = await accountRepository.create({
      userId: String(user._id),
      accountName: `${user.firstName} ${user.lastName}`,
      balance: 0,
    });

    const { accessToken, refreshToken } = tokenManager.generateTokenPair(
      String(user._id),
      user.email,
      user.role,
    );

    await redisService.setRefreshToken(
      String(user._id),
      refreshToken,
      tokenManager.getRefreshTokenTTL(),
    );

    const safeUser = omit(user.toObject(), ['password', '__v']);

    return {
      user: safeUser,
      account,
      tokens: { accessToken, refreshToken },
    };
  }

  async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid credentials');
    }

    const { accessToken, refreshToken } = tokenManager.generateTokenPair(
      String(user._id),
      user.email,
      user.role,
    );

    await redisService.setRefreshToken(
      String(user._id),
      refreshToken,
      tokenManager.getRefreshTokenTTL(),
    );

    const safeUser = omit(user.toObject(), ['password', '__v']);

    return {
      user: safeUser,
      tokens: { accessToken, refreshToken },
    };
  }

  async refreshToken(oldRefreshToken: string) {
    const decoded = tokenManager.verifyToken(oldRefreshToken) as {
      userId: string;
      email: string;
      role: string;
    };

    const storedToken = await redisService.getRefreshToken(decoded.userId);
    if (!storedToken || storedToken !== oldRefreshToken) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const user = await userRepository.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw ApiError.unauthorized('User not found or inactive');
    }

    const { accessToken, refreshToken } = tokenManager.generateTokenPair(
      String(user._id),
      user.email,
      user.role,
    );

    await redisService.setRefreshToken(
      String(user._id),
      refreshToken,
      tokenManager.getRefreshTokenTTL(),
    );

    return { accessToken, refreshToken };
  }

  async logout(userId: string): Promise<void> {
    await redisService.deleteRefreshToken(userId);
  }
}

export const authService = new AuthService();
export default authService;
