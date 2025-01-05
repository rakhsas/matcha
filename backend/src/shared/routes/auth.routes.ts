import express from 'express';
import { login, register, resetPasswordRequest, resetPasswordVerification } from '../../modules/auth/auth.controller';
import { validateData } from '../utils/validationMiddleware';
import { loginSchema, resetPasswordSchema } from '../../modules/auth/auth.validation';
import resetMiddleware from '../middleware/reset.middleware';
import { userRegistrationSchema } from '../../modules/user/user.validation';

const router = express.Router();
router.post('/register', validateData(userRegistrationSchema), register);
router.post('/login', validateData(loginSchema), login);
router.post('/reset-password-req', resetPasswordRequest);
router.post('/reset-password-ver', resetMiddleware, validateData(resetPasswordSchema), resetPasswordVerification);
export default router;