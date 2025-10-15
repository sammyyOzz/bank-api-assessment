import { Request, Response, NextFunction } from 'express';
import accountService from './account.service';

class AccountController {
  async getMyAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const accounts = await accountService.getAccountsByUserId(userId);

      res.status(200).json({
        success: true,
        message: 'Accounts retrieved successfully',
        accounts,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AccountController();
