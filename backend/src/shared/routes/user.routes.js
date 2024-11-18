import express from 'express';
import { createUser } from '../../modules/user/user.controller.js';
import { isPublic } from '../decorators/public.decorator.js';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();

// router.post('/authenticate/register', createUser);
router.get('/protected', authMiddleware, (req, res) => {
    res.send({message: 'This is a public route'});
});

export default router;