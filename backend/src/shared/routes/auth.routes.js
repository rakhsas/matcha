import express from 'express';
import { login, register, resetPasswordRequest, resetPasswordVerification } from '../../modules/auth/auth.controller.js';
import resetMiddleware from '../middleware/reset.middleware.js';
const router = express.Router();

router.post('/register', (register));
router.post('/login', (login));
router.post('/reset-password-req', resetPasswordRequest);
router.post('/reset-password-ver', resetMiddleware, resetPasswordVerification);
export default router;