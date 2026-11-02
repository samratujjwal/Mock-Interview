import { Router } from 'express';
import { getMe, updateProfile, deleteAvatar, deleteAccount } from '../controllers/users.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { avatarUpload } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/me', requireAuth, getMe);
// Accept multipart/form-data with optional 'avatar' file
router.put('/profile', requireAuth, avatarUpload.single('avatar'), updateProfile);
// Delete avatar
router.delete('/avatar', requireAuth, deleteAvatar);
router.delete('/account', requireAuth, deleteAccount);

export default router;
