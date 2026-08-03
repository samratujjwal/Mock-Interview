import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createCompletion, evaluateAnswer, generateCodingQuestionsHandler, generateFollowUp, generateQuestions } from '../controllers/ai.controller.js';

const router = Router();

router.post('/completions', requireAuth, createCompletion);
router.post('/evaluate', requireAuth, evaluateAnswer);
router.post('/follow-up', requireAuth, generateFollowUp);
router.post('/questions', requireAuth, generateQuestions);
router.post('/questions/coding', requireAuth, generateCodingQuestionsHandler);
router.post('/questions/:type', requireAuth, generateQuestions);
router.post('/questions/follow-up', requireAuth, generateFollowUp);

export default router;
