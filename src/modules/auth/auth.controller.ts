import { Request, Response } from 'express';
import { authService } from './auth.service';
import asyncHandler from '../../utils/async-handler';

class AuthController {
  signup = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.signup(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        account: result.account,
        tokens: result.tokens,
      },
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        tokens: result.tokens,
      },
    });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: { tokens },
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    await authService.logout(req.user!.userId);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  });
}

export const authController = new AuthController();
