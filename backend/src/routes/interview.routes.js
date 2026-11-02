import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { rateLimiter } from "../utils/rateLimiter.js";
import {
  createInterview,
  listInterviews,
  getInterview,
  updateInterview,
  addInterviewQuestion,
  submitInterviewQuestionAnswer,
  getInterviewCurrentQuestion,
  nextInterviewQuestion,
  pauseInterview,
  resumeInterview,
  finishInterview,
  cancelInterview,
  getInterviewHistory,
} from "../controllers/interviewSession.controller.js";
import {
  createTemplate,
  listTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
  getFallbackTemplate,
} from "../controllers/interviewTemplate.controller.js";

const router = Router();
const interviewRateLimit = rateLimiter({ windowMs: 60_000, max: 60 });

router.post("/templates", requireAuth, createTemplate);
router.get("/templates", requireAuth, listTemplates);
router.get("/templates/fallback", requireAuth, getFallbackTemplate);
router.get("/templates/:id", requireAuth, getTemplate);
router.put("/templates/:id", requireAuth, updateTemplate);
router.delete("/templates/:id", requireAuth, deleteTemplate);

// NOTE: /history must be registered before /:id so Express doesn't treat
// "history" as an :id param.
router.get("/history", requireAuth, getInterviewHistory);

router.post("/", requireAuth, interviewRateLimit, createInterview);
router.get("/", requireAuth, listInterviews);
router.get("/:id", requireAuth, getInterview);
router.put("/:id", requireAuth, updateInterview);
router.delete("/:id", requireAuth, cancelInterview);

router.get("/:id/question", requireAuth, getInterviewCurrentQuestion);
router.post("/:id/next", requireAuth, nextInterviewQuestion);
router.patch("/:id/pause", requireAuth, pauseInterview);
router.patch("/:id/resume", requireAuth, resumeInterview);
router.patch("/:id/finish", requireAuth, finishInterview);

router.post("/:id/answer", requireAuth, submitInterviewQuestionAnswer);
router.post("/:id/questions", requireAuth, addInterviewQuestion);
router.post(
  "/:id/questions/:questionId/answers",
  requireAuth,
  submitInterviewQuestionAnswer,
);

export default router;
