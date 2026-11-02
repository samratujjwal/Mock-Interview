import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { resumeUpload } from '../middleware/upload.middleware.js';
import {
  uploadResume,
  listResumes,
  getResume,
  deleteResume,
} from '../controllers/resume.controller.js';
import { parseResume } from '../controllers/resumeParse.controller.js';
import { extractResume } from '../controllers/resumeExtract.controller.js';
import {
  analyzeResumeWeaknesses,
  getResumeWeaknesses,
} from '../controllers/resumeWeakness.controller.js';

const router = Router();

router.post('/upload', requireAuth, resumeUpload.single('file'), uploadResume);
router.post('/:id/parse', requireAuth, parseResume);
router.post('/:id/extract', requireAuth, extractResume);
router.post('/:id/weaknesses', requireAuth, analyzeResumeWeaknesses);
router.get('/:id/weaknesses', requireAuth, getResumeWeaknesses);
router.get('/', requireAuth, listResumes);
router.get('/:id', requireAuth, getResume);
router.delete('/:id', requireAuth, deleteResume);

export default router;
