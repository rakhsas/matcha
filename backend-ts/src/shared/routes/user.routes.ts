import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { saveProfile } from '../../modules/user/profile.controller.js';
import { validateData } from '../utils/validationMiddleware.js';
import { profileSchema } from '../../modules/user/profile.validation.js';
const router = express.Router();


router.get('/protected', authMiddleware, (req, res) => {
    res.send({message: 'This is a public route'});
});
router.post('/user/profile', authMiddleware, validateData(profileSchema), saveProfile);

export default router;