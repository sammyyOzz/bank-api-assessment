import Joi from 'joi';

const baseTransactionSchema = Joi.object({
  accountNumber: Joi.string()
    .required()
    .trim()
    .pattern(/^[0-9]+$/)
    .messages({
      'string.empty': 'Account number is required',
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

export const depositFundsSchema = baseTransactionSchema;

export const withdrawFundsSchema = baseTransactionSchema;

export const transferFundsSchema = baseTransactionSchema.keys({
  accountNumber: Joi.forbidden(), // disables it
  fromAccountNumber: Joi.string()
    .required()
    .pattern(/^[0-9]+$/),
  toAccountNumber: Joi.string()
    .required()
    .pattern(/^[0-9]+$/),
});
