import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

export const comparePasswordWithHash = async (password: string, hashedPassword: string) => {
  const isEquivalent = await bcrypt.compare(password, hashedPassword);
  return isEquivalent;
};
