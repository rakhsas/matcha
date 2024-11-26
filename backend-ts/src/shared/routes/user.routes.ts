import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { saveProfile, getProfile, updateProfile } from '../../modules/user/profile.controller.js';
import { validateData } from '../utils/validationMiddleware.js';
import { profileSchema, profileUpdateSchema } from '../../modules/user/profile.validation.js';
const router = express.Router();


router.get('/protected', authMiddleware, (req, res) => {
    res.send({message: 'This is a public route'});
});
router.post('/user/profile', authMiddleware, validateData(profileSchema), saveProfile);
router.get('/user/profile', authMiddleware, getProfile);
router.patch('/user/profile', authMiddleware, validateData(profileUpdateSchema), updateProfile);
export default router;