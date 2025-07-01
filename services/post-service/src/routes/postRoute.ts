import { Router } from 'express';
import { createUser } from '../controllers/postController';

const router = Router();

router.post('/create', createUser);

export default router;