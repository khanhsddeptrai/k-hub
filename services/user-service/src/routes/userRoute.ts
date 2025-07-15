import { Router } from 'express';
import { updateUser, getUserProfile, createUser, getAllProfile, getUserByIds } from '../controllers/userController';
import { checkPermission, isAuthenticated } from '../middlewares/authorized';

const router = Router();

router.get('/profile/get-all', getAllProfile);
router.patch('/update-profile', checkPermission('edit_user'), updateUser);
router.get('/profile/:userId', isAuthenticated, getUserProfile);
router.post('/profile/create', createUser);
router.get('/profile-post', getUserByIds);

export default router;