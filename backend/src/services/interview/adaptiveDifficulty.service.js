const DIFFICULTY_ORDER = ['easy', 'medium', 'hard'];

function safeText(value) {
  return String(value || '').trim();
}

function safeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function toNumber(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function normalizeDifficulty(value) {
  const normalized = safeText(value || 'medium').toLowerCase();
  return DIFFICULTY_ORDER.includes(normalized) ? normalized : 'medium';
}

function getHigherDifficulty(value) {
  const index = DIFFICULTY_ORDER.indexOf(normalizeDifficulty(value));
  return DIFFICULTY_ORDER[Math.min(index + 1, DIFFICULTY_ORDER.length - 1)] || 'medium';
}

function getLowerDifficulty(value) {
  const index = DIFFICULTY_ORDER.indexOf(normalizeDifficulty(value));
  return DIFFICULTY_ORDER[Math.max(index - 1, 0)] || 'easy';
}

function getAverage(items = []) {
  const numericItems = items
    .map((item) => toNumber(item))
    .filter((item) => item != null);

  if (numericItems.length === 0) return null;
  return numericItems.reduce((sum, item) => sum + item, 0) / numericItems.length;
}

function summarizeMemory(memory = {}) {
  const normalized = safeObject(memory);
  const history = Array.isArray(normalized.conversationHistory) ? normalized.conversationHistory : [];
  const scores = history.map((entry) => toNumber(entry.score)).filter((entry) => entry != null);
  const confidenceScores = history
    .map((entry) => toNumber(entry.confidence))
    .filter((entry) => entry != null);
  const topicSignals = safeObject(normalized.topicSignals);
  const weaknessCount = Array.isArray(normalized.weaknesses) ? normalized.weaknesses.length : 0;
  const strengthCount = Array.isArray(normalized.strengths) ? normalized.strengths.length : 0;

  return {
    averageScore: getAverage(scores),
    averageConfidence: getAverage(confidenceScores),
    weaknessCount,
    strengthCount,
    topicSignals,
    historyCount: history.length,
  };
}

export function deriveAdaptiveDifficulty(memory = {}, requestedDifficulty = 'medium') {
  const base = normalizeDifficulty(requestedDifficulty);
  const summary = summarizeMemory(memory);
  const difficultyLog = {
    requestedDifficulty: base,
    averageScore: summary.averageScore,
    averageConfidence: summary.averageConfidence,
    strengthCount: summary.strengthCount,
    weaknessCount: summary.weaknessCount,
    historyCount: summary.historyCount,
  };

  if (summary.averageScore == null && summary.averageConfidence == null) {
    return {
      difficulty: base,
      reason: 'No answer signal available yet; preserving initial difficulty.',
      log: difficultyLog,
    };
  }

  if (summary.averageScore >= 80 && summary.averageConfidence >= 70 && summary.weaknessCount <= 1) {
    return {
      difficulty: getHigherDifficulty(base),
      reason: 'Strong performance trending upward; escalating difficulty one step.',
      log: difficultyLog,
    };
  }

  if (summary.averageScore <= 45 || summary.averageConfidence <= 40 || summary.weaknessCount >= 3) {
    return {
      difficulty: getLowerDifficulty(base),
      reason: 'The candidate is struggling; lowering difficulty to support foundational recall.',
      log: difficultyLog,
    };
  }

  if (summary.averageScore >= 65 && base === 'easy') {
    return {
      difficulty: 'medium',
      reason: 'The candidate is performing above easy baseline; moving to medium.',
      log: difficultyLog,
    };
  }

  if (summary.averageScore <= 55 && base === 'hard') {
    return {
      difficulty: 'medium',
      reason: 'Hard difficulty is not matching current performance; stepping back to medium.',
      log: difficultyLog,
    };
  }

  return {
    difficulty: base,
    reason: 'Performance signals are stable; preserving the current difficulty level.',
    log: difficultyLog,
  };
}
