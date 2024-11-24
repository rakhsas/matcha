import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
const router = express.Router();


router.get('/protected', authMiddleware, (req, res) => {
    res.send({message: 'This is a public route'});
});


export default router;