import express from 'express';
import { createUser } from '../../modules/user/user.controller.js';
const router = express.Router();

// router.post('/authenticate/register', createUser);
router.get('/protected', (req, res) => {
    res.json({ message: 'Protected route' });
});

export default router;