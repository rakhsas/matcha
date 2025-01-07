import express from 'express';
import authMiddleware from './../middleware/auth.middleware';
import {
	saveProfile,
	getProfile,
	updateProfile,
} from '../../modules/user/controllers/profile.controller';
import { validateData } from '../utils/validationMiddleware';
import {
	profileSchema,
	profileUpdateSchema,
} from '../../modules/user/profile.validation';
import { getUsersWithRelations } from '../../modules/user/controllers/user.controller';
import {
	getUserViewers,
	getUserViewersCount,
	getUserViewersWithRelations,
	saveUserViewer,
} from '../../modules/user/controllers/viewers.controller';

const router = express.Router();

router.get('/protected', authMiddleware, (req, res) => {
	res.send({ message: 'This is a public route' });
});
router.post(
	'/profile',
	authMiddleware,
	validateData(profileSchema),
	saveProfile,
);
router.get('/profile', authMiddleware, getProfile);
router.patch(
	'/profile',
	authMiddleware,
	validateData(profileUpdateSchema),
	updateProfile,
);
router.post('/infos', authMiddleware, saveProfile);
router.get('/infos', authMiddleware, getUsersWithRelations);
router.get('/views', authMiddleware, getUserViewers);
router.get('/views/count', authMiddleware, getUserViewersCount);
router.get('/views/relations', authMiddleware, getUserViewersWithRelations);
router.post('/views', authMiddleware, saveUserViewer);
export default router;
