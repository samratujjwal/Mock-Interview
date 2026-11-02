import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { resumeUpload } from '../middleware/upload.middleware.js';
import {
  uploadJD,
  listJDs,
  getJD,
  deleteJD,
  parseJD,
} from '../controllers/jobDescription.controller.js';
import { matchResumeToJd } from '../controllers/jobDescriptionMatch.controller.js';

const router = Router();

router.post('/upload', requireAuth, resumeUpload.single('file'), uploadJD);
router.post('/:id/parse', requireAuth, parseJD);
router.post('/:id/match', requireAuth, matchResumeToJd);
router.get('/', requireAuth, listJDs);
router.get('/:id', requireAuth, getJD);
router.delete('/:id', requireAuth, deleteJD);

export default router;
