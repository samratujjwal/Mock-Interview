import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { rateLimiter } from '../utils/rateLimiter.js';
import {
  createInterview,
  listInterviews,
  getInterview,
  updateInterview,
  addInterviewQuestion,
  submitInterviewQuestionAnswer,
} from '../controllers/interviewSession.controller.js';
import {
  createTemplate,
  listTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  getFallbackTemplate,
} from '../controllers/interviewTemplate.controller.js';

const router = Router();
const interviewRateLimit = rateLimiter({ windowMs: 60_000, max: 60 });

router.post('/templates', requireAuth, createTemplate);
router.get('/templates', requireAuth, listTemplates);
router.get('/templates/fallback', requireAuth, getFallbackTemplate);
router.get('/templates/:id', requireAuth, getTemplate);
router.put('/templates/:id', requireAuth, updateTemplate);
router.delete('/templates/:id', requireAuth, deleteTemplate);

router.post('/', requireAuth, interviewRateLimit, createInterview);
router.get('/', requireAuth, listInterviews);
router.get('/:id', requireAuth, getInterview);
router.put('/:id', requireAuth, updateInterview);
router.post('/:id/answer', requireAuth, submitInterviewQuestionAnswer);
router.post('/:id/questions', requireAuth, addInterviewQuestion);
router.post('/:id/questions/:questionId/answers', requireAuth, submitInterviewQuestionAnswer);

export default router;
