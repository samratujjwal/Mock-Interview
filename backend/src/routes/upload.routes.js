import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { fileUpload } from '../middleware/upload.middleware.js';
import { uploadFile } from '../controllers/upload.controller.js';

const router = Router();

router.post('/', requireAuth, fileUpload.single('file'), uploadFile);

export default router;
