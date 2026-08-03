import crypto from "crypto";
import mongoose from "mongoose";
import { InterviewSession } from "../../models/index.js";
import {
  appendAnswerToMemory,
  appendQuestionToMemory,
  buildInitialSessionMemory,
} from "./contextMemory.service.js";
import { findFallbackInterviewTemplate } from "./template.service.js";
import { generateSessionReport } from "./report.service.js";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

function normalizeEnumValue(value, fallback = "") {
  return String(value || fallback)
    .trim()
    .toLowerCase();
}

export async function createInterviewSession(userId, data = {}) {
  const fallbackQuestions = [];
  const fallbackTemplate = await findFallbackInterviewTemplate(
    {
      type: normalizeEnumValue(data.type, "technical"),
      difficulty: normalizeEnumValue(data.difficulty, "medium"),
      companyMode: normalizeEnumValue(data.companyMode, "product"),
      topic: data.topic || null,
    },
    Array.isArray(data.excludeDuplicateKeys) ? data.excludeDuplicateKeys : [],
  );

  if (fallbackTemplate) {
    fallbackQuestions.push({
      questionId: String(fallbackTemplate._id || crypto.randomUUID()).trim(),
      duplicateKey: String(fallbackTemplate.duplicateKey || "").trim() || null,
      prompt: String(fallbackTemplate.prompt || "").trim(),
      type: String(fallbackTemplate.type || "technical").trim(),
      topic: String(fallbackTemplate.topic || "").trim() || null,
      difficulty: String(fallbackTemplate.difficulty || "medium").trim(),
      metadata: fallbackTemplate.metadata || {},
    });
  }

  const initialQuestions =
    Array.isArray(data.questions) && data.questions.length > 0
      ? data.questions.map((question) => ({
          questionId: String(question.questionId || crypto.randomUUID()).trim(),
          duplicateKey: String(question.duplicateKey || "").trim() || null,
          prompt: String(question.prompt || "").trim(),
          type: normalizeEnumValue(question.type, "technical"),
          topic: String(question.topic || "").trim() || null,
          difficulty: normalizeEnumValue(question.difficulty, "medium"),
          metadata: question.metadata || {},
        }))
      : fallbackQuestions;

  const initialMemory = buildInitialSessionMemory({
    memory: data.memory || {},
    resumeSummary: data.resumeSummary,
    jobDescriptionSummary: data.jobDescriptionSummary,
  });

  const hydratedMemory = initialQuestions.reduce(
    (memory, question) => appendQuestionToMemory(memory, question),
    initialMemory,
  );

  const initialStatus = String(data.status || "Pending").trim();

  const payload = {
    userId,
    resumeId: data.resumeId || null,
    jobDescriptionId: data.jobDescriptionId || null,
    title: String(data.title || "Mock interview session").trim(),
    role: String(data.role || "General").trim(),
    type: normalizeEnumValue(data.type, "technical"),
    difficulty: normalizeEnumValue(data.difficulty, "medium"),
    companyMode: normalizeEnumValue(data.companyMode, "product"),
    personality: normalizeEnumValue(data.personality, "professional"),
    practiceMode: Boolean(data.practiceMode),
    hintUsageCount: 0,
    status: initialStatus,
    startedAt: initialStatus === "Active" ? new Date() : null,
    memory: hydratedMemory,
    questions: initialQuestions,
  };

  return InterviewSession.create(payload);
}

export async function listInterviewSessionsByUser(
  userId,
  { page = 1, limit = 10 } = {},
) {
  const safePage =
    Number.parseInt(page, 10) >= 1 ? Number.parseInt(page, 10) : 1;
  const safeLimit =
    Number.parseInt(limit, 10) >= 1 ? Number.parseInt(limit, 10) : 10;
  const skip = (safePage - 1) * safeLimit;

  const [sessions, total] = await Promise.all([
    InterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean()
      .exec(),
    InterviewSession.countDocuments({ userId }).exec(),
  ]);

  return {
    sessions,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
}

export async function getInterviewSessionById(userId, sessionId) {
  if (!isValidObjectId(sessionId)) return null;
  return InterviewSession.findOne({ _id: sessionId, userId }).lean().exec();
}

export async function updateInterviewSession(userId, sessionId, updates = {}) {
  if (!isValidObjectId(sessionId)) return null;
  const allowedUpdates = [
    "title",
    "role",
    "type",
    "difficulty",
    "companyMode",
    "personality",
    "status",
    "memory",
    "currentQuestionIndex",
    "summary",
    "totalScore",
    "startedAt",
    "completedAt",
  ];
  const payload = {};
  for (const key of allowedUpdates) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      payload[key] = updates[key];
    }
  }

  return InterviewSession.findOneAndUpdate(
    { _id: sessionId, userId },
    { $set: payload },
    { new: true },
  )
    .lean()
    .exec();
}

export async function addQuestionToSession(
  userId,
  sessionId,
  questionData = {},
) {
  if (!isValidObjectId(sessionId)) return null;

  const question = {
    questionId: String(questionData.questionId || crypto.randomUUID()).trim(),
    duplicateKey: String(questionData.duplicateKey || "").trim() || null,
    prompt: String(questionData.prompt || "").trim(),
    type: normalizeEnumValue(questionData.type, "technical"),
    topic: String(questionData.topic || "").trim() || null,
    difficulty: normalizeEnumValue(questionData.difficulty, "medium"),
    metadata: questionData.metadata || {},
    status: "pending",
    answer: {},
  };

  const currentSession = await InterviewSession.findOne({
    _id: sessionId,
    userId,
  })
    .lean()
    .exec();
  const nextMemory = appendQuestionToMemory(
    currentSession?.memory || {},
    question,
  );

  const result = await InterviewSession.findOneAndUpdate(
    { _id: sessionId, userId },
    {
      $push: { questions: question },
      $set: { memory: nextMemory },
    },
    { new: true },
  )
    .lean()
    .exec();

  return result;
}

export async function submitInterviewAnswer(
  userId,
  sessionId,
  questionId,
  answerData = {},
) {
  if (!isValidObjectId(sessionId) || !questionId) return null;

  const currentSession = await InterviewSession.findOne({
    _id: sessionId,
    userId,
  })
    .lean()
    .exec();
  const question = (currentSession?.questions || []).find(
    (entry) => String(entry.questionId) === String(questionId),
  );
  const submittedAt = answerData.submittedAt || new Date();

  const answerPayload = {
    "questions.$.answer.response":
      String(answerData.response || "").trim() || null,
    "questions.$.answer.submittedAt": submittedAt,
    "questions.$.answer.score": Number.isFinite(Number(answerData.score))
      ? Number(answerData.score)
      : null,
    "questions.$.answer.feedback":
      String(answerData.feedback || "").trim() || null,
    "questions.$.answer.aiEvaluation":
      String(answerData.aiEvaluation || "").trim() || null,
    "questions.$.answer.responseTimeMs": Number.isFinite(
      Number(answerData.responseTimeMs),
    )
      ? Number(answerData.responseTimeMs)
      : null,
    "questions.$.answer.thinkingTimeMs": Number.isFinite(
      Number(answerData.thinkingTimeMs),
    )
      ? Number(answerData.thinkingTimeMs)
      : null,
    "questions.$.answer.confidence": Number.isFinite(
      Number(answerData.confidence),
    )
      ? Number(answerData.confidence)
      : null,
    "questions.$.answer.evaluatedAt": answerData.evaluatedAt || null,
    "questions.$.status": "answered",
  };

  const updatedMemory = appendAnswerToMemory(
    currentSession?.memory || {},
    question || {},
    {
      ...answerData,
      submittedAt,
    },
  );

  const result = await InterviewSession.findOneAndUpdate(
    { _id: sessionId, userId, "questions.questionId": questionId },
    { $set: { ...answerPayload, memory: updatedMemory } },
    { new: true },
  )
    .lean()
    .exec();

  return result;
}

// ---------------------------------------------------------------------------
// T-054: Hint engine persistence
// ---------------------------------------------------------------------------

export async function recordHintUsage(userId, sessionId, questionId, hint) {
  if (!isValidObjectId(sessionId) || !questionId) return null;

  return InterviewSession.findOneAndUpdate(
    { _id: sessionId, userId, "questions.questionId": questionId },
    {
      $push: {
        "questions.$.hints": {
          level: hint.level,
          text: hint.text,
          requestedAt: new Date(),
        },
      },
      $inc: { hintUsageCount: 1 },
    },
    { new: true },
  )
    .lean()
    .exec();
}

// ---------------------------------------------------------------------------
// T-055: Interview lifecycle (state machine + question navigation)
// ---------------------------------------------------------------------------

// Which statuses a session is allowed to move to, from its current status.
const ALLOWED_TRANSITIONS = {
  Pending: ["Active", "Cancelled"],
  Active: ["Paused", "Completed", "Cancelled"],
  Paused: ["Active", "Cancelled"],
  Completed: [],
  Cancelled: [],
};

export class InvalidTransitionError extends Error {
  constructor(from, to) {
    super(`Cannot move interview session from "${from}" to "${to}".`);
    this.name = "InvalidTransitionError";
    this.from = from;
    this.to = to;
  }
}

async function transitionSessionStatus(
  userId,
  sessionId,
  nextStatus,
  extraFields = {},
) {
  if (!isValidObjectId(sessionId)) return null;

  const currentSession = await InterviewSession.findOne({
    _id: sessionId,
    userId,
  })
    .lean()
    .exec();
  if (!currentSession) return null;

  const allowed = ALLOWED_TRANSITIONS[currentSession.status] || [];
  if (!allowed.includes(nextStatus)) {
    throw new InvalidTransitionError(currentSession.status, nextStatus);
  }

  return InterviewSession.findOneAndUpdate(
    { _id: sessionId, userId },
    { $set: { status: nextStatus, ...extraFields } },
    { new: true },
  )
    .lean()
    .exec();
}

export async function startInterviewSession(userId, sessionId) {
  return transitionSessionStatus(userId, sessionId, "Active", {
    startedAt: new Date(),
  });
}

export async function pauseInterviewSession(userId, sessionId) {
  return transitionSessionStatus(userId, sessionId, "Paused");
}

export async function resumeInterviewSession(userId, sessionId) {
  return transitionSessionStatus(userId, sessionId, "Active");
}

export async function cancelInterviewSession(userId, sessionId) {
  return transitionSessionStatus(userId, sessionId, "Cancelled");
}

export async function finishInterviewSession(userId, sessionId) {
  const currentSession = await InterviewSession.findOne({
    _id: sessionId,
    userId,
  })
    .lean()
    .exec();
  if (!currentSession) return null;

  const scoredAnswers = (currentSession.questions || [])
    .map((q) => q.answer?.score)
    .filter((score) => Number.isFinite(Number(score)));

  const totalScore =
    scoredAnswers.length > 0
      ? Math.round(
          scoredAnswers.reduce((sum, score) => sum + Number(score), 0) /
            scoredAnswers.length,
        )
      : null;

  const completedSession = await transitionSessionStatus(userId, sessionId, "Completed", {
    completedAt: new Date(),
    totalScore,
  });

  if (completedSession) {
    const report = generateSessionReport({
      ...completedSession,
      questions: currentSession.questions || [],
      status: "Completed",
    });

    await InterviewSession.findOneAndUpdate(
      { _id: sessionId, userId },
      { $set: { report } },
      { new: true },
    ).exec();
  }

  return completedSession;
}

// A session can only receive new answers while it is Active.
export function assertSessionIsAnswerable(session) {
  if (!session) return;
  if (session.status !== "Active") {
    throw new InvalidTransitionError(session.status, "answer");
  }
}

export async function getCurrentQuestion(userId, sessionId) {
  if (!isValidObjectId(sessionId)) return null;
  const session = await InterviewSession.findOne({ _id: sessionId, userId })
    .lean()
    .exec();
  if (!session) return null;

  const question = session.questions?.[session.currentQuestionIndex] || null;
  return { session, question, index: session.currentQuestionIndex };
}

export async function advanceToNextQuestion(userId, sessionId) {
  if (!isValidObjectId(sessionId)) return null;
  const session = await InterviewSession.findOne({ _id: sessionId, userId })
    .lean()
    .exec();
  if (!session) return null;

  const nextIndex = session.currentQuestionIndex + 1;
  const hasNextQuestion = nextIndex < (session.questions || []).length;

  const updated = await InterviewSession.findOneAndUpdate(
    { _id: sessionId, userId },
    {
      $set: {
        currentQuestionIndex: hasNextQuestion
          ? nextIndex
          : session.currentQuestionIndex,
      },
    },
    { new: true },
  )
    .lean()
    .exec();

  return {
    session: updated,
    question: hasNextQuestion ? updated.questions[nextIndex] : null,
    index: updated.currentQuestionIndex,
    isLastQuestion: !hasNextQuestion,
  };
}
