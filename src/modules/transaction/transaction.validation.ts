import Joi from 'joi';

export const initiateTransactionSchema = Joi.object({
  toAccountNumber: Joi.string()
    .required()
    .trim()
    .pattern(/^[0-9]+$/)
    .messages({
      'string.empty': 'Recipient account number is required',
      'string.pattern.base': 'Account number must contain only digits',
    }),

  amount: Joi.number().positive().precision(2).required().messages({
    'number.base': 'Amount must be a valid number',
    'number.positive': 'Amount must be greater than zero',
    'any.required': 'Amount is required',
  }),

  description: Joi.string().max(200).allow('', null).messages({
    'string.max': 'Description must not exceed 200 characters',
  }),
});
