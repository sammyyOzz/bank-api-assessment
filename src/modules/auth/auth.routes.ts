import express from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { refreshTokenSchema, signinSchema, signupSchema } from './auth.validation';

const router = express.Router();

router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(signinSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

export default router;
