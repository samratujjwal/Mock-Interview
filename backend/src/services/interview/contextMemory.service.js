const MAX_RECENT_INTERACTIONS = 8;
const MAX_TECHNOLOGIES = 12;
const MAX_STRENGTHS = 6;
const MAX_WEAKNESSES = 6;

function safeText(value) {
  return String(value || '').trim();
}

function safeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function normalizeMemory(memory = {}) {
  const base = safeObject(memory);
  return {
    conversationHistory: Array.isArray(base.conversationHistory) ? base.conversationHistory.slice(0, MAX_RECENT_INTERACTIONS) : [],
    topicSignals: safeObject(base.topicSignals),
    technologies: Array.isArray(base.technologies) ? base.technologies.slice(0, MAX_TECHNOLOGIES) : [],
    strengths: Array.isArray(base.strengths) ? base.strengths.slice(0, MAX_STRENGTHS) : [],
    weaknesses: Array.isArray(base.weaknesses) ? base.weaknesses.slice(0, MAX_WEAKNESSES) : [],
    lastUpdatedAt: base.lastUpdatedAt || null,
    summary: safeText(base.summary) || '',
  };
}

function addUniqueItems(list = [], items = [], maxSize = MAX_RECENT_INTERACTIONS) {
  return Array.from(new Set(
    [...list, ...items]
      .map((item) => safeText(item))
      .filter(Boolean)
  )).slice(0, maxSize);
}

function extractTechnologyHints(text = '') {
  const normalized = safeText(text).toLowerCase();
  if (!normalized) return [];

  const keywords = [
    'javascript', 'typescript', 'node.js', 'nodejs', 'react', 'next.js', 'python', 'java', 'go', 'sql',
    'mongodb', 'mysql', 'postgres', 'redis', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'system design',
    'microservices', 'api', 'rest', 'graphql', 'testing', 'typescript', 'express', 'mongoose'
  ];

  return keywords.filter((keyword) => normalized.includes(keyword));
}

function updateTopicSignals(topicSignals = {}, question = {}, answerData = {}) {
  const normalized = safeObject(topicSignals);
  const topic = safeText(question.topic || question.duplicateKey || 'general');
  const type = safeText(question.type || 'technical');
  const difficulty = safeText(question.difficulty || 'medium');

  if (!topic) return normalized;

  const existing = normalized[topic] || { count: 0, type, difficulty, lastAnsweredAt: null };
  const nextTopic = {
    ...existing,
    count: Number(existing.count || 0) + 1,
    type: type || existing.type,
    difficulty: difficulty || existing.difficulty,
    lastAnsweredAt: answerData?.submittedAt || new Date().toISOString(),
  };

  normalized[topic] = nextTopic;
  return normalized;
}

function buildConversationEntry(question = {}, answerData = {}) {
  return {
    questionId: safeText(question.questionId),
    prompt: safeText(question.prompt),
    type: safeText(question.type || 'technical'),
    topic: safeText(question.topic || question.duplicateKey || 'general'),
    difficulty: safeText(question.difficulty || 'medium'),
    answer: safeText(answerData.response || ''),
    submittedAt: answerData.submittedAt || new Date().toISOString(),
    score: Number.isFinite(Number(answerData.score)) ? Number(answerData.score) : null,
    feedback: safeText(answerData.feedback || ''),
    aiEvaluation: safeText(answerData.aiEvaluation || ''),
    confidence: Number.isFinite(Number(answerData.confidence)) ? Number(answerData.confidence) : null,
  };
}

export function buildInitialSessionMemory(options = {}) {
  const memory = normalizeMemory(options.memory || {});
  const resumeSummary = safeText(options.resumeSummary || options.resumeText || '');
  const jobDescriptionSummary = safeText(options.jobDescriptionSummary || options.jobDescriptionText || '');
  const backgroundSummary = [resumeSummary, jobDescriptionSummary].filter(Boolean).join(' ');

  memory.conversationHistory = [];
  memory.topicSignals = {};
  memory.technologies = addUniqueItems(memory.technologies, extractTechnologyHints(backgroundSummary), MAX_TECHNOLOGIES);
  memory.lastUpdatedAt = new Date().toISOString();
  memory.summary = backgroundSummary ? backgroundSummary.slice(0, 400) : memory.summary;

  return memory;
}

export function appendQuestionToMemory(memory = {}, question = {}) {
  const normalized = normalizeMemory(memory);
  const nextHistory = [
    buildConversationEntry(question, {}),
    ...normalized.conversationHistory,
  ].slice(0, MAX_RECENT_INTERACTIONS);

  normalized.conversationHistory = nextHistory;
  normalized.technologies = addUniqueItems(
    normalized.technologies,
    extractTechnologyHints(question.prompt || ''),
    MAX_TECHNOLOGIES
  );
  normalized.topicSignals = updateTopicSignals(normalized.topicSignals, question, {});
  normalized.lastUpdatedAt = new Date().toISOString();

  return normalized;
}

export function appendAnswerToMemory(memory = {}, question = {}, answerData = {}) {
  const normalized = normalizeMemory(memory);
  const candidate = buildConversationEntry(question, answerData);
  const history = normalized.conversationHistory || [];
  const existingIndex = history.findIndex((entry) => safeText(entry.questionId) === safeText(question.questionId));
  const nextHistory = [...history];

  if (existingIndex >= 0) {
    nextHistory[existingIndex] = candidate;
  } else {
    nextHistory.unshift(candidate);
  }

  normalized.conversationHistory = nextHistory.slice(0, MAX_RECENT_INTERACTIONS);
  normalized.technologies = addUniqueItems(
    normalized.technologies,
    extractTechnologyHints(`${candidate.prompt} ${candidate.answer}`),
    MAX_TECHNOLOGIES
  );
  normalized.topicSignals = updateTopicSignals(normalized.topicSignals, question, answerData);

  if (Number.isFinite(Number(answerData.score))) {
    const score = Number(answerData.score);
    if (score >= 70) {
      normalized.strengths = addUniqueItems(normalized.strengths, [safeText(question.topic || question.type)], MAX_STRENGTHS);
    } else {
      normalized.weaknesses = addUniqueItems(normalized.weaknesses, [safeText(question.topic || question.type)], MAX_WEAKNESSES);
    }
  }

  normalized.lastUpdatedAt = new Date().toISOString();
  return normalized;
}

export function getMemoryContext(memory = {}) {
  const normalized = normalizeMemory(memory);
  const history = (normalized.conversationHistory || []).map((entry) => ({
    questionId: entry.questionId,
    prompt: entry.prompt,
    topic: entry.topic,
    type: entry.type,
    answer: entry.answer,
    score: entry.score,
    feedback: entry.feedback,
  }));

  return {
    conversationHistory: history,
    topicSignals: normalized.topicSignals,
    technologies: normalized.technologies,
    strengths: normalized.strengths,
    weaknesses: normalized.weaknesses,
    summary: normalized.summary,
    lastUpdatedAt: normalized.lastUpdatedAt,
  };
}
