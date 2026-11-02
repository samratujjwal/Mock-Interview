import crypto from 'crypto';
import { aiService } from '../ai/ai.service.js';
import { safeJsonParse } from '../ai/response.service.js';
import { promptService } from '../prompt.service.js';
import { deriveAdaptiveDifficulty } from './adaptiveDifficulty.service.js';
import { listQuestionBankCandidates } from './questionBank.service.js';

const ALLOWED_TYPES = new Set(['technical', 'behavioral', 'hr', 'system_design', 'mixed', 'coding', 'follow-up']);
const ALLOWED_DIFFICULTIES = new Set(['easy', 'medium', 'hard']);

function normalizeQuestionType(type) {
  return String(type || 'technical').trim().toLowerCase();
}

function normalizeDifficulty(value) {
  return String(value || 'medium').trim().toLowerCase();
}

function normalizeCompanyMode(value) {
  return String(value || 'product').trim().toLowerCase();
}

function normalizeTopic(value) {
  return value ? String(value).trim() : null;
}

function normalizeQuestionPayload(question = {}, fallbackType = 'technical', fallbackDifficulty = 'medium') {
  const prompt = String(question.prompt || '').trim();
  if (!prompt) return null;

  const duplicateKey = String(question.duplicateKey || question.prompt || crypto.randomUUID()).trim();

  return {
    questionId: String(question.questionId || crypto.randomUUID()).trim(),
    duplicateKey: duplicateKey || null,
    prompt,
    type: ALLOWED_TYPES.has(normalizeQuestionType(question.type))
      ? normalizeQuestionType(question.type)
      : fallbackType,
    topic: normalizeTopic(question.topic),
    difficulty: ALLOWED_DIFFICULTIES.has(normalizeDifficulty(question.difficulty))
      ? normalizeDifficulty(question.difficulty)
      : fallbackDifficulty,
    metadata: question.metadata && typeof question.metadata === 'object' ? question.metadata : {},
  };
}

function dedupeQuestions(questions = []) {
  const seen = new Set();
  const result = [];

  for (const question of questions) {
    if (!question || !question.prompt) continue;
    const duplicateKey = String(question.duplicateKey || question.prompt).trim().toLowerCase();
    if (!duplicateKey || seen.has(duplicateKey)) continue;
    seen.add(duplicateKey);
    result.push(question);
  }

  return result;
}

function buildPromptContext({ type, difficulty, companyMode, topic, role, resumeSummary, jobDescriptionSummary, previousQuestions, count }) {
  return {
    role: role || 'General Candidate',
    type: normalizeQuestionType(type),
    difficulty: normalizeDifficulty(difficulty),
    companyMode: normalizeCompanyMode(companyMode),
    topic: normalizeTopic(topic),
    resumeSummary: resumeSummary ? String(resumeSummary).trim() : 'No resume details provided.',
    jobDescriptionSummary: jobDescriptionSummary ? String(jobDescriptionSummary).trim() : 'No job description details provided.',
    previousQuestions: Array.isArray(previousQuestions) && previousQuestions.length > 0
      ? previousQuestions.map((entry) => String(entry.prompt || '').trim()).filter(Boolean).join('\n- ')
      : 'None yet.',
    count: Number.isInteger(count) && count > 0 ? count : 3,
  };
}

function extractQuestionsFromAiResponse(rawResponse) {
  if (!rawResponse || typeof rawResponse !== 'object') {
    return [];
  }

  const parsed = safeJsonParse(rawResponse.text || rawResponse.content || rawResponse);
  if (parsed.error || !Array.isArray(parsed.data)) {
    return [];
  }

  return parsed.data
    .map((question) => normalizeQuestionPayload(question, 'technical', 'medium'))
    .filter(Boolean);
}

async function generateFallbackQuestions({ type, difficulty, companyMode, topic, existingDuplicateKeys = [], count = 3 }) {
  const candidates = await listQuestionBankCandidates(
    {
      type: normalizeQuestionType(type),
      difficulty: normalizeDifficulty(difficulty),
      companyMode: normalizeCompanyMode(companyMode),
      topic: normalizeTopic(topic),
    },
    existingDuplicateKeys
  );

  return candidates
    .slice(0, Math.max(1, Number(count) || 3))
    .map((candidate) => ({
      questionId: String(candidate._id || crypto.randomUUID()).trim(),
      duplicateKey: String(candidate.duplicateKey || candidate.prompt || candidate._id || '').trim() || null,
      prompt: String(candidate.prompt || '').trim(),
      type: normalizeQuestionType(candidate.type),
      topic: normalizeTopic(candidate.topic),
      difficulty: normalizeDifficulty(candidate.difficulty),
      metadata: candidate.metadata || {},
    }))
    .filter((question) => question.prompt);
}

export async function generateInterviewQuestions(options = {}) {
  const {
    type = 'technical',
    difficulty = 'medium',
    companyMode = 'product',
    topic = null,
    role = 'General Candidate',
    resumeSummary = '',
    jobDescriptionSummary = '',
    previousQuestions = [],
    count = 3,
    existingDuplicateKeys = [],
    useAi = true,
    memory = {},
  } = options;

  const normalizedType = normalizeQuestionType(type);
  const normalizedDifficulty = normalizeDifficulty(difficulty);
  const resolution = deriveAdaptiveDifficulty(memory, normalizedDifficulty);
  const resolvedDifficulty = resolution.difficulty;
  const normalizedCompanyMode = normalizeCompanyMode(companyMode);
  const requestedCount = Math.max(1, Math.min(Number(count) || 3, 5));
  const allDuplicateKeys = Array.isArray(existingDuplicateKeys)
    ? existingDuplicateKeys.map((key) => String(key || '').trim()).filter(Boolean)
    : [];

  const promptContext = buildPromptContext({
    type: normalizedType,
    difficulty: resolvedDifficulty,
    companyMode: normalizedCompanyMode,
    topic: normalizeTopic(topic),
    role,
    resumeSummary,
    jobDescriptionSummary,
    previousQuestions,
    count: requestedCount,
  });

  let fallbackQuestions = [];
  try {
    fallbackQuestions = await generateFallbackQuestions({
      type: normalizedType,
      difficulty: resolvedDifficulty,
      companyMode: normalizedCompanyMode,
      topic: normalizeTopic(topic),
      existingDuplicateKeys: allDuplicateKeys,
      count: requestedCount,
    });
  } catch (err) {
    console.warn('Interview question fallback generation failed', err);
    fallbackQuestions = [];
  }

  if (!useAi) {
    return dedupeQuestions(fallbackQuestions).slice(0, requestedCount);
  }

  try {
    const prompt = promptService.renderPrompt({
      key: 'interview.questions',
      version: 'v1',
      values: promptContext,
    });

    const aiResult = await aiService.request({
      prompt,
      temperature: 0.8,
      maxTokens: 700,
      metadata: {
        route: 'interview.questions',
        interviewType: normalizedType,
        difficulty: resolvedDifficulty,
        companyMode: normalizedCompanyMode,
        topic: normalizeTopic(topic),
        adaptiveDifficultyLog: resolution.log,
      },
    });

    const aiQuestions = extractQuestionsFromAiResponse(aiResult)
      .filter((question) => question.type && ALLOWED_TYPES.has(question.type))
      .map((question) => ({
        ...question,
        duplicateKey: String(question.duplicateKey || question.prompt).trim().toLowerCase() || null,
      }));

    const normalizedQuestions = dedupeQuestions([
      ...aiQuestions,
      ...fallbackQuestions,
    ]).slice(0, requestedCount);

    if (normalizedQuestions.length > 0) {
      return normalizedQuestions;
    }
  } catch (err) {
    console.warn('Interview question AI generation failed, falling back to question bank', err);
  }

  return dedupeQuestions(fallbackQuestions).slice(0, requestedCount);
}
