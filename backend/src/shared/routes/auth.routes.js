import express from 'express';
import { login, register } from '../../modules/auth/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { Public } from '../decorators/public.decorator.js';
const router = express.Router();

router.post('/register', Public, register);
router.post('/login', Public, login);

export default router;