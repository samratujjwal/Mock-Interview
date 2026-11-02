import mongoose from 'mongoose';
import {
  createInterviewSession,
  listInterviewSessionsByUser,
  getInterviewSessionById,
  updateInterviewSession,
  addQuestionToSession,
  submitInterviewAnswer,
} from '../services/interview/session.service.js';
import { generateFollowUpQuestion } from '../services/interview/followUpEngine.service.js';

const allowedInterviewTypes = ['technical', 'behavioral', 'system_design', 'mixed'];
const allowedDifficultyLevels = ['easy', 'medium', 'hard'];
const allowedCompanyModes = ['startup', 'product', 'FAANG', 'scale-up'];

function success(res, data = {}, message = 'Success') {
  return res.json({ success: true, message, data });
}

function error(res, status, message, errors = []) {
  return res.status(status).json({ success: false, message, data: {}, errors });
}

function normalizeForValidation(value) {
  return String(value || '').trim().toLowerCase();
}

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(String(id));
}

export async function createInterview(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { resumeId, jobDescriptionId, role, title, type, difficulty, companyMode, memory, questions } = req.body;
    const errors = [];

    if (!role || !String(role).trim()) {
      errors.push({ field: 'role', message: 'Role is required.' });
    }

    const normalizedType = normalizeForValidation(type);
    const normalizedDifficulty = normalizeForValidation(difficulty);
    const normalizedCompanyMode = normalizeForValidation(companyMode);

    if (!allowedInterviewTypes.includes(normalizedType)) {
      errors.push({ field: 'type', message: 'Interview type must be one of technical, behavioral, system_design, or mixed.' });
    }

    if (!allowedDifficultyLevels.includes(normalizedDifficulty)) {
      errors.push({ field: 'difficulty', message: 'Difficulty must be one of easy, medium, or hard.' });
    }

    if (!allowedCompanyModes.includes(normalizedCompanyMode)) {
      errors.push({ field: 'companyMode', message: 'Company mode must be one of startup, product, FAANG, or scale-up.' });
    }

    if (resumeId && !isValidObjectId(resumeId)) {
      errors.push({ field: 'resumeId', message: 'Resume id must be a valid ObjectId.' });
    }

    if (jobDescriptionId && !isValidObjectId(jobDescriptionId)) {
      errors.push({ field: 'jobDescriptionId', message: 'Job description id must be a valid ObjectId.' });
    }

    if (questions !== undefined && !Array.isArray(questions)) {
      errors.push({ field: 'questions', message: 'Questions must be provided as an array when supplied.' });
    }

    if (errors.length > 0) {
      return error(res, 422, 'Validation failed', errors);
    }

    const session = await createInterviewSession(String(userId), {
      resumeId,
      jobDescriptionId,
      role,
      title,
      type: normalizedType,
      difficulty: normalizedDifficulty,
      companyMode: normalizedCompanyMode,
      memory,
      questions,
      status: 'Active',
    });

    const firstQuestion = session?.questions?.[0] || null;

    return success(res, {
      sessionId: session?._id,
      firstQuestionId: firstQuestion?.questionId || null,
      firstQuestion,
      session,
    }, 'Interview session started');
  } catch (err) {
    console.error('Create interview session error', err);
    return error(res, 500, 'Failed to create interview session');
  }
}

export async function listInterviews(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { page = 1, limit = 10 } = req.query;
    const result = await listInterviewSessionsByUser(String(userId), { page, limit });
    return success(res, { sessions: result.sessions, meta: result.meta }, 'Interview sessions retrieved');
  } catch (err) {
    console.error('List interview sessions error', err);
    return error(res, 500, 'Failed to retrieve interview sessions');
  }
}

export async function getInterview(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    if (!id) return error(res, 422, 'Interview session id is required');

    const session = await getInterviewSessionById(String(userId), id);
    if (!session) return error(res, 404, 'Interview session not found');

    return success(res, { session }, 'Interview session retrieved');
  } catch (err) {
    console.error('Get interview session error', err);
    return error(res, 500, 'Failed to retrieve interview session');
  }
}

export async function updateInterview(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    if (!id) return error(res, 422, 'Interview session id is required');

    const updates = req.body || {};
    const session = await updateInterviewSession(String(userId), id, updates);
    if (!session) return error(res, 404, 'Interview session not found');

    return success(res, { session }, 'Interview session updated');
  } catch (err) {
    console.error('Update interview session error', err);
    return error(res, 500, 'Failed to update interview session');
  }
}

export async function addInterviewQuestion(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id } = req.params;
    if (!id) return error(res, 422, 'Interview session id is required');

    const { prompt, type, topic, difficulty, metadata } = req.body;
    if (!prompt || !String(prompt).trim()) return error(res, 422, 'Question prompt is required');

    const session = await addQuestionToSession(String(userId), id, { prompt, type, topic, difficulty, metadata });
    if (!session) return error(res, 404, 'Interview session not found');

    return success(res, { session }, 'Question added to interview session');
  } catch (err) {
    console.error('Add interview question error', err);
    return error(res, 500, 'Failed to add interview question');
  }
}

export async function submitInterviewQuestionAnswer(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) return error(res, 401, 'Unauthenticated');

    const { id, questionId: pathQuestionId } = req.params;
    if (!id) return error(res, 422, 'Interview session id is required');

    const { questionId = pathQuestionId, response, score, feedback, aiEvaluation, responseTimeMs, thinkingTimeMs, confidence, evaluatedAt } = req.body;
    if (!questionId) return error(res, 422, 'Question id is required');
    if (!response || !String(response).trim()) return error(res, 422, 'Answer response is required');

    const session = await submitInterviewAnswer(String(userId), id, questionId, {
      response,
      score,
      feedback,
      aiEvaluation,
      responseTimeMs,
      thinkingTimeMs,
      confidence,
      evaluatedAt,
    });
    if (!session) return error(res, 404, 'Interview session or question not found');

    const answeredQuestion = session.questions?.find((question) => String(question._id || question.id) === String(questionId));
    const followUpQuestion = await generateFollowUpQuestion({
      role: session.role,
      type: session.type,
      difficulty: session.difficulty,
      companyMode: session.companyMode,
      currentQuestion: answeredQuestion?.prompt || response,
      answer: response,
      memory: session.memory,
    });

    return success(res, { session, followUpQuestion }, 'Interview answer submitted');
  } catch (err) {
    console.error('Submit interview answer error', err);
    return error(res, 500, 'Failed to submit interview answer');
  }
}
