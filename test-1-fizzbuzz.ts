const isMultipleOfThree = (num: number): boolean => num % 3 === 0;
const isMultipleOfFive = (num: number): boolean => num % 5 === 0;

const getFizzBuzz = (num: number): string | number => {
  if (isMultipleOfThree(num) && isMultipleOfFive(num)) {
    return 'FizzBuzz';
  }
  if (isMultipleOfThree(num)) {
    return 'Fizz';
  }
  if (isMultipleOfFive(num)) {
    return 'Buzz';
  }
  return num;
};

const fizzBuzz = () => {
  for (let i = 1; i <= 100; i++) {
    console.log(getFizzBuzz(i));
  }
};
