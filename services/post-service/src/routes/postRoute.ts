import { Router } from 'express';
import { createPost, getAllPostByUser } from '../controllers/postController';
import multer from 'multer'

const upload = multer({ dest: 'uploads/' });
const router = Router();

router.post('/create', upload.array('media', 5), createPost);
router.get('/get-all', getAllPostByUser);

export default router;