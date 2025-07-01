import { Router } from 'express';
import {
    registerUser, loginUser, assignPermissionToRole, assignRoleToUser, authorizeUser,
    getAuthInfo
} from '../controllers/authController';
import { getFacebookToken, getGoogleToken, loginWithFacebook, loginWithGoogle } from '../controllers/OAuthController';
const router = Router();

router.get('/get-all-info', getAuthInfo);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/asign-permission/:roleId', assignPermissionToRole);
router.post('/asign-role/:userId', assignRoleToUser);
router.post('/authorize', authorizeUser);

router.post('/google-token', getGoogleToken);
router.post('/google-login', loginWithGoogle);

router.post('/facebook-token', getFacebookToken);
router.post('/facebook-login', loginWithFacebook);

export default router;