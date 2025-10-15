import { accountRepository } from './account.repository';

class AccountService {
  async getAccountsByUserId(userId: string) {
    return await accountRepository.findAll({ userId });
  }
}

export default new AccountService();
