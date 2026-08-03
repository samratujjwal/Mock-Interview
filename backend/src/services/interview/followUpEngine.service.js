import crypto from 'crypto';
import { aiService } from '../ai/ai.service.js';
import { safeJsonParse } from '../ai/response.service.js';
import { promptService } from '../prompt.service.js';

const TYPE_ORDER = ['technical', 'behavioral', 'follow-up', 'system_design', 'mixed'];
const DIFFICULTY_ORDER = ['easy', 'medium', 'hard'];

function safeText(value) {
  return String(value || '').trim();
}

function safeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function normalizeType(value, fallback = 'technical') {
  const normalized = safeText(value || fallback).toLowerCase();
  return TYPE_ORDER.includes(normalized) ? normalized : fallback;
}

function normalizeDifficulty(value, fallback = 'medium') {
  const normalized = safeText(value || fallback).toLowerCase();
  return DIFFICULTY_ORDER.includes(normalized) ? normalized : fallback;
}

function buildFallbackQuestion({ currentQuestion = '', answer = '', memory = {}, preferredTopic = null } = {}) {
  const topic = preferredTopic || safeText(memory?.topicSignals ? Object.keys(safeObject(memory.topicSignals))[0] : 'general');
  const lowerAnswer = safeText(answer).toLowerCase();
  const followUpType = lowerAnswer.includes('why') || lowerAnswer.includes('how') || safeText(answer).length < 80
    ? 'follow-up'
    : 'technical';

  return {
    questionId: crypto.randomUUID(),
    duplicateKey: `followup:${safeText(topic || preferredTopic || 'general')}`,
    prompt: `Can you walk through the trade-offs in ${topic || 'your approach'} using the example you just described?`,
    type: normalizeType(followUpType),
    topic: safeText(topic || preferredTopic || 'general') || null,
    difficulty: 'medium',
    metadata: {
      source: 'fallback',
      reason: 'No AI follow-up response was available, so a deterministic fallback question was generated from the memory context.',
    },
  };
}

function getPreferredTopic(memory = {}, currentTopic = null) {
  const normalizedMemory = safeObject(memory);
  const topicSignals = safeObject(normalizedMemory.topicSignals);
  const technologies = Array.isArray(normalizedMemory.technologies) ? normalizedMemory.technologies : [];
  const signalEntries = Object.entries(topicSignals)
    .map(([topic, data]) => ({ topic, count: Number(data?.count || 0) }))
    .sort((a, b) => b.count - a.count);

  const nonCurrent = signalEntries.find((entry) => entry.topic !== currentTopic);
  if (nonCurrent) return nonCurrent.topic;

  const technology = technologies.find((entry) => safeText(entry) && safeText(entry) !== currentTopic);
  if (technology) return safeText(technology);

  return safeText(currentTopic || 'general');
}

function normalizeQuestionPayload(raw = {}) {
  if (!raw || typeof raw !== 'object') return null;
  const prompt = safeText(raw.prompt);
  if (!prompt) return null;

  return {
    questionId: safeText(raw.questionId || crypto.randomUUID()),
    duplicateKey: safeText(raw.duplicateKey || prompt).toLowerCase() || null,
    prompt,
    type: normalizeType(raw.type, 'technical'),
    topic: safeText(raw.topic || null) || null,
    difficulty: normalizeDifficulty(raw.difficulty, 'medium'),
    metadata: raw.metadata && typeof raw.metadata === 'object' ? raw.metadata : {},
  };
}

export async function generateFollowUpQuestion({
  role = 'General Candidate',
  type = 'technical',
  difficulty = 'medium',
  companyMode = 'product',
  personality = 'professional',
  currentQuestion = '',
  answer = '',
  memory = {},
} = {}) {
  const preferredTopic = getPreferredTopic(memory, safeText(currentQuestion || ''));
  const normalizedType = normalizeType(type, 'technical');
  const normalizedDifficulty = normalizeDifficulty(difficulty, 'medium');
  const normalizedMemory = safeObject(memory);
  const technologies = Array.isArray(normalizedMemory.technologies) ? normalizedMemory.technologies.join(', ') : '';
  const prompt = promptService.renderPrompt({
    key: 'interview.followup',
    version: 'v1',
    values: {
      role,
      type: normalizedType,
      difficulty: normalizedDifficulty,
      companyMode: safeText(companyMode || 'product'),
      personality: safeText(personality || 'professional'),
      currentQuestion: safeText(currentQuestion),
      answer: safeText(answer),
      memory: JSON.stringify(normalizedMemory),
      technologies,
      preferredTopic,
    },
  });

  try {
    const aiResult = await aiService.request({
      prompt,
      temperature: 0.5,
      maxTokens: 450,
      metadata: {
        route: 'interview.followup',
        preferredTopic,
      },
    });

    const parsed = safeJsonParse(aiResult?.text || aiResult?.raw || '{}');
    if (parsed.error || !parsed.data || typeof parsed.data !== 'object') {
      return buildFallbackQuestion({ currentQuestion, answer, memory, preferredTopic });
    }

    return normalizeQuestionPayload(parsed.data) || buildFallbackQuestion({ currentQuestion, answer, memory, preferredTopic });
  } catch (err) {
    console.warn('Interview follow-up generation failed, using deterministic fallback', err);
    return buildFallbackQuestion({ currentQuestion, answer, memory, preferredTopic });
  }
}
