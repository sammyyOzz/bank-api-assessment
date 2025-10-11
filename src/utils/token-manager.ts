import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../config/config';
import { CACHE_TTL } from '../config/constants';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class TokenManager {
  generateAccessToken(payload: TokenPayload): string {
    const secret: Secret = config.jwt.secret;
    const options: SignOptions = {
      expiresIn: config.jwt.accessExpiration as any,
    };
    return jwt.sign(payload, secret, options);
  }

  generateRefreshToken(payload: TokenPayload): string {
    const secret: Secret = config.jwt.secret;
    const options: SignOptions = {
      expiresIn: config.jwt.refreshExpiration as any,
    };
    return jwt.sign(payload, secret, options);
  }

  verifyToken(token: string): JwtPayload | string {
    try {
      const secret: Secret = config.jwt.secret;
      return jwt.verify(token, secret);
    } catch {
      throw new Error('Invalid or expired token');
    }
  }

  generateTokenPair(userId: string, email: string, role: string): TokenPair {
    const payload: TokenPayload = { userId, email, role };
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  getRefreshTokenTTL(): number {
    return CACHE_TTL.USER_SESSION;
  }
}

export const tokenManager = new TokenManager();
export default tokenManager;
