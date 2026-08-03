import mongoose from "mongoose";
import {
  createInterviewSession,
  listInterviewSessionsByUser,
  getInterviewSessionById,
  updateInterviewSession,
  addQuestionToSession,
  submitInterviewAnswer,
  startInterviewSession,
  pauseInterviewSession,
  resumeInterviewSession,
  cancelInterviewSession,
  finishInterviewSession,
  getCurrentQuestion,
  advanceToNextQuestion,
  assertSessionIsAnswerable,
  recordHintUsage,
  InvalidTransitionError,
} from "../services/interview/session.service.js";
import { generateFollowUpQuestion } from "../services/interview/followUpEngine.service.js";
import {
  generateHint,
  getMaxHintLevel,
} from "../services/interview/hint.service.js";

const allowedInterviewTypes = [
  "technical",
  "behavioral",
  "system_design",
  "mixed",
];
const allowedDifficultyLevels = ["easy", "medium", "hard"];
const allowedCompanyModes = ["startup", "product", "faang", "scale-up"];
const allowedPersonalities = [
  "friendly",
  "professional",
  "strict",
  "startup",
  "faang",
  "hr",
  "behavioral",
];

function success(res, data = {}, message = "Success") {
  return res.json({ success: true, message, data });
}

function error(res, status, message, errors = []) {
  return res.status(status).json({ success: false, message, data: {}, errors });
}

function normalizeForValidation(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

export async function createInterview(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const {
      resumeId,
      jobDescriptionId,
      role,
      title,
      type,
      difficulty,
      companyMode,
      personality,
      practiceMode,
      memory,
      questions,
    } = req.body;
    const errors = [];

    if (!role || !String(role).trim()) {
      errors.push({ field: "role", message: "Role is required." });
    }

    const normalizedType = normalizeForValidation(type);
    const normalizedDifficulty = normalizeForValidation(difficulty);
    const normalizedCompanyMode = normalizeForValidation(companyMode);
    const normalizedPersonality = normalizeForValidation(personality || "professional");

    if (!allowedInterviewTypes.includes(normalizedType)) {
      errors.push({
        field: "type",
        message:
          "Interview type must be one of technical, behavioral, system_design, or mixed.",
      });
    }

    if (!allowedDifficultyLevels.includes(normalizedDifficulty)) {
      errors.push({
        field: "difficulty",
        message: "Difficulty must be one of easy, medium, or hard.",
      });
    }

    if (!allowedCompanyModes.includes(normalizedCompanyMode)) {
      errors.push({
        field: "companyMode",
        message:
          "Company mode must be one of startup, product, faang, or scale-up.",
      });
    }

    if (!allowedPersonalities.includes(normalizedPersonality)) {
      errors.push({
        field: "personality",
        message:
          "Personality must be one of friendly, professional, strict, startup, faang, hr, or behavioral.",
      });
    }

    if (resumeId && !isValidObjectId(resumeId)) {
      errors.push({
        field: "resumeId",
        message: "Resume id must be a valid ObjectId.",
      });
    }

    if (jobDescriptionId && !isValidObjectId(jobDescriptionId)) {
      errors.push({
        field: "jobDescriptionId",
        message: "Job description id must be a valid ObjectId.",
      });
    }

    if (questions !== undefined && !Array.isArray(questions)) {
      errors.push({
        field: "questions",
        message: "Questions must be provided as an array when supplied.",
      });
    }

    if (errors.length > 0) {
      return error(res, 422, "Validation failed", errors);
    }

    const session = await createInterviewSession(String(userId), {
      resumeId,
      jobDescriptionId,
      role,
      title,
      type: normalizedType,
      difficulty: normalizedDifficulty,
      companyMode: normalizedCompanyMode,
      personality: normalizedPersonality,
      practiceMode: Boolean(practiceMode),
      memory,
      questions,
      status: "Active",
    });

    const firstQuestion = session?.questions?.[0] || null;

    return success(
      res,
      {
        sessionId: session?._id,
        firstQuestionId: firstQuestion?.questionId || null,
        firstQuestion,
        session,
      },
      "Interview session started",
    );
  } catch (err) {
    console.error("Create interview session error", err);
    return error(res, 500, "Failed to create interview session");
  }
}

export async function listInterviews(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const { page = 1, limit = 10 } = req.query;
    const result = await listInterviewSessionsByUser(String(userId), {
      page,
      limit,
    });
    return success(
      res,
      { sessions: result.sessions, meta: result.meta },
      "Interview sessions retrieved",
    );
  } catch (err) {
    console.error("List interview sessions error", err);
    return error(res, 500, "Failed to retrieve interview sessions");
  }
}

export async function getInterview(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const { id } = req.params;
    if (!id) return error(res, 422, "Interview session id is required");

    const session = await getInterviewSessionById(String(userId), id);
    if (!session) return error(res, 404, "Interview session not found");

    return success(res, { session }, "Interview session retrieved");
  } catch (err) {
    console.error("Get interview session error", err);
    return error(res, 500, "Failed to retrieve interview session");
  }
}

export async function updateInterview(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const { id } = req.params;
    if (!id) return error(res, 422, "Interview session id is required");

    const updates = req.body || {};
    const session = await updateInterviewSession(String(userId), id, updates);
    if (!session) return error(res, 404, "Interview session not found");

    return success(res, { session }, "Interview session updated");
  } catch (err) {
    console.error("Update interview session error", err);
    return error(res, 500, "Failed to update interview session");
  }
}

export async function addInterviewQuestion(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const { id } = req.params;
    if (!id) return error(res, 422, "Interview session id is required");

    const { prompt, type, topic, difficulty, metadata } = req.body;
    if (!prompt || !String(prompt).trim())
      return error(res, 422, "Question prompt is required");

    const session = await addQuestionToSession(String(userId), id, {
      prompt,
      type,
      topic,
      difficulty,
      metadata,
    });
    if (!session) return error(res, 404, "Interview session not found");

    return success(res, { session }, "Question added to interview session");
  } catch (err) {
    console.error("Add interview question error", err);
    return error(res, 500, "Failed to add interview question");
  }
}

export async function submitInterviewQuestionAnswer(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const { id, questionId: pathQuestionId } = req.params;
    if (!id) return error(res, 422, "Interview session id is required");

    const {
      questionId = pathQuestionId,
      response,
      score,
      feedback,
      aiEvaluation,
      responseTimeMs,
      thinkingTimeMs,
      confidence,
      evaluatedAt,
    } = req.body;
    if (!questionId) return error(res, 422, "Question id is required");
    if (!response || !String(response).trim())
      return error(res, 422, "Answer response is required");

    const existingSession = await getInterviewSessionById(String(userId), id);
    if (!existingSession) return error(res, 404, "Interview session not found");

    try {
      assertSessionIsAnswerable(existingSession);
    } catch (transitionErr) {
      if (transitionErr instanceof InvalidTransitionError) {
        return error(
          res,
          400,
          `Cannot submit an answer: session status is "${transitionErr.from}".`,
        );
      }
      throw transitionErr;
    }

    const session = await submitInterviewAnswer(
      String(userId),
      id,
      questionId,
      {
        response,
        score,
        feedback,
        aiEvaluation,
        responseTimeMs,
        thinkingTimeMs,
        confidence,
        evaluatedAt,
      },
    );
    if (!session)
      return error(res, 404, "Interview session or question not found");

    const answeredQuestion = session.questions?.find(
      (question) => String(question.questionId) === String(questionId),
    );
    const followUpQuestion = await generateFollowUpQuestion({
      role: session.role,
      type: session.type,
      difficulty: session.difficulty,
      companyMode: session.companyMode,
      personality: session.personality,
      currentQuestion: answeredQuestion?.prompt || response,
      answer: response,
      memory: session.memory,
    });

    return success(
      res,
      { session, followUpQuestion },
      "Interview answer submitted",
    );
  } catch (err) {
    console.error("Submit interview answer error", err);
    return error(res, 500, "Failed to submit interview answer");
  }
}

// ---------------------------------------------------------------------------
// T-055: Interview lifecycle endpoints
// ---------------------------------------------------------------------------

function handleTransitionError(res, err, fallbackMessage) {
  if (err instanceof InvalidTransitionError) {
    return error(res, 400, err.message);
  }
  console.error(fallbackMessage, err);
  return error(res, 500, fallbackMessage);
}

export async function getInterviewCurrentQuestion(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const { id } = req.params;
    const result = await getCurrentQuestion(String(userId), id);
    if (!result) return error(res, 404, "Interview session not found");

    return success(res, result, "Current question retrieved");
  } catch (err) {
    console.error("Get current question error", err);
    return error(res, 500, "Failed to retrieve current question");
  }
}

export async function nextInterviewQuestion(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const { id } = req.params;
    const result = await advanceToNextQuestion(String(userId), id);
    if (!result) return error(res, 404, "Interview session not found");

    return success(
      res,
      result,
      result.isLastQuestion
        ? "No more questions in this session"
        : "Advanced to next question",
    );
  } catch (err) {
    console.error("Advance interview question error", err);
    return error(res, 500, "Failed to advance to next question");
  }
}

export async function pauseInterview(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const { id } = req.params;
    const session = await pauseInterviewSession(String(userId), id);
    if (!session) return error(res, 404, "Interview session not found");

    return success(res, { session }, "Interview session paused");
  } catch (err) {
    return handleTransitionError(res, err, "Failed to pause interview session");
  }
}

export async function resumeInterview(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const { id } = req.params;
    const session = await resumeInterviewSession(String(userId), id);
    if (!session) return error(res, 404, "Interview session not found");

    return success(res, { session }, "Interview session resumed");
  } catch (err) {
    return handleTransitionError(
      res,
      err,
      "Failed to resume interview session",
    );
  }
}

export async function finishInterview(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const { id } = req.params;
    const session = await finishInterviewSession(String(userId), id);
    if (!session) return error(res, 404, "Interview session not found");

    return success(res, { session }, "Interview session completed");
  } catch (err) {
    return handleTransitionError(
      res,
      err,
      "Failed to finish interview session",
    );
  }
}

export async function cancelInterview(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const { id } = req.params;
    const session = await cancelInterviewSession(String(userId), id);
    if (!session) return error(res, 404, "Interview session not found");

    return success(res, { session }, "Interview session cancelled");
  } catch (err) {
    return handleTransitionError(
      res,
      err,
      "Failed to cancel interview session",
    );
  }
}

export async function getInterviewHistory(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const { page = 1, limit = 10, status } = req.query;
    const result = await listInterviewSessionsByUser(String(userId), {
      page,
      limit,
    });
    const sessions = status
      ? result.sessions.filter((s) => s.status === status)
      : result.sessions;

    return success(
      res,
      { sessions, meta: result.meta },
      "Interview history retrieved",
    );
  } catch (err) {
    console.error("Get interview history error", err);
    return error(res, 500, "Failed to retrieve interview history");
  }
}

// ---------------------------------------------------------------------------
// T-054: Hint engine (practice mode)
// ---------------------------------------------------------------------------

export async function requestInterviewHint(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, "Unauthenticated");

    const { id, questionId } = req.params;
    if (!id || !questionId)
      return error(
        res,
        422,
        "Interview session id and question id are required",
      );

    const session = await getInterviewSessionById(String(userId), id);
    if (!session) return error(res, 404, "Interview session not found");

    if (!session.practiceMode) {
      return error(
        res,
        403,
        "Hints are only available in practice mode for this session",
      );
    }

    const question = session.questions?.find(
      (entry) => String(entry.questionId) === String(questionId),
    );
    if (!question) return error(res, 404, "Question not found in this session");

    const hintsUsed = question.hints?.length || 0;
    if (hintsUsed >= getMaxHintLevel()) {
      return success(
        res,
        { hints: question.hints, hintsUsed },
        "No more hints available for this question",
      );
    }

    const hint = await generateHint({
      role: session.role,
      type: session.type,
      difficulty: session.difficulty,
      currentQuestion: question.prompt,
      answer: question.answer?.response || req.body?.answer || "",
      topic: question.topic,
      hintLevel: hintsUsed + 1,
    });

    const updatedSession = await recordHintUsage(
      String(userId),
      id,
      questionId,
      hint,
    );
    if (!updatedSession)
      return error(res, 404, "Interview session or question not found");

    return success(res, { hint, session: updatedSession }, "Hint generated");
  } catch (err) {
    console.error("Request interview hint error", err);
    return error(res, 500, "Failed to generate hint");
  }
}
