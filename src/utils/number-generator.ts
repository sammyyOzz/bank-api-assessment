import crypto from 'crypto';

class NumberGenerator {
  private prefix: string;

  private length: number;

  constructor(prefix: string = '10', length: number = 10) {
    this.prefix = prefix;
    this.length = length;
  }

  generate(): string {
    const digitsNeeded = this.length - this.prefix.length;

    if (digitsNeeded <= 0) {
      throw new Error('Length must be greater than prefix length');
    }

    const maxValue = Math.pow(10, digitsNeeded);
    const randomNumber = crypto.randomInt(0, maxValue);

    const paddedNumber = randomNumber.toString().padStart(digitsNeeded, '0');

    return this.prefix + paddedNumber;
  }

  setPrefix(prefix: string): this {
    this.prefix = prefix;
    return this;
  }

  setLength(length: number): this {
    this.length = length;
    return this;
  }
}

export const accountNumberGenerator = new NumberGenerator('10', 10);
export const transactionRefGenerator = new NumberGenerator('TXN', 16);

export default NumberGenerator;
