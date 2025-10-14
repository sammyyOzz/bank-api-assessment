import Joi, { ObjectSchema } from 'joi';
import { UserRoles } from '../users/user.types';

export const signupSchema: ObjectSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  role: Joi.string().valid(UserRoles.CUSTOMER, UserRoles.ADMIN).optional(),
});

export const signinSchema: ObjectSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const refreshTokenSchema: ObjectSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
