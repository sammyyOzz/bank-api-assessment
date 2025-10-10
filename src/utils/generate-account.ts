export const generateAccountNumber = (): string => {
  return '10' + Date.now().toString() + Math.floor(Math.random() * 1000);
};
