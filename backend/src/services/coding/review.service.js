import { aiService } from '../ai/ai.service.js';
import { safeJsonParse } from '../ai/response.service.js';
import { promptService } from '../prompt.service.js';

function getHeuristicComplexity(sourceCode = '') {
  const normalized = String(sourceCode).toLowerCase();

  if (normalized.includes('sort') || normalized.includes('binary')) {
    return {
      estimatedTimeComplexity: 'O(n log n)',
      estimatedSpaceComplexity: 'O(log n)',
      confidence: 'medium',
      explanation: 'Estimated from sorting or divide-and-conquer style operations.',
    };
  }

  if ((normalized.match(/for\s*\(/g) || []).length > 1 || (normalized.match(/while\s*\(/g) || []).length > 0 && normalized.includes('for')) {
    return {
      estimatedTimeComplexity: 'O(n^2)',
      estimatedSpaceComplexity: 'O(1)',
      confidence: 'medium',
      explanation: 'Estimated from nested traversal or repeated scans.',
    };
  }

  if (normalized.includes('for') || normalized.includes('while')) {
    return {
      estimatedTimeComplexity: 'O(n)',
      estimatedSpaceComplexity: 'O(1)',
      confidence: 'medium',
      explanation: 'Estimated from a single linear traversal of the input.',
    };
  }

  return {
    estimatedTimeComplexity: 'O(1)',
    estimatedSpaceComplexity: 'O(1)',
    confidence: 'low',
    explanation: 'Estimated from a compact implementation with no obvious looping structure.',
  };
}

function buildFallbackPayload() {
  const complexity = getHeuristicComplexity('');
  return {
    review: {
      summary: 'The solution is in good shape for a first pass. Focus on clarifying edge cases and tightening the control flow.',
      strengths: ['The code has a clear intent.', 'The approach is easy to follow for a quick review.'],
      improvements: ['Add explicit edge-case handling.', 'Trim redundant checks or intermediary variables.'],
      risks: ['Some corner cases may still be uncovered.', 'A more verbose implementation can be harder to maintain.'],
    },
    complexity: {
      ...complexity,
    },
    debuggingHints: [
      'Trace the function with a small sample input and compare the expected output step by step.',
      'Verify the base case and termination conditions before you submit.',
    ],
    optimizationHints: [
      'Reduce repeated work by hoisting reusable values or avoiding extra scans.',
      'Prefer clear variable names and helper functions when the logic becomes hard to follow.',
    ],
  };
}

function normalizePayload(raw = {}) {
  const fallback = buildFallbackPayload();
  if (!raw || typeof raw !== 'object') {
    return fallback;
  }

  const review = raw.review && typeof raw.review === 'object' ? raw.review : {};
  const complexity = raw.complexity && typeof raw.complexity === 'object' ? raw.complexity : {};

  return {
    review: {
      summary: String(review.summary || fallback.review.summary).trim(),
      strengths: Array.isArray(review.strengths) ? review.strengths.map((entry) => String(entry)) : fallback.review.strengths,
      improvements: Array.isArray(review.improvements) ? review.improvements.map((entry) => String(entry)) : fallback.review.improvements,
      risks: Array.isArray(review.risks) ? review.risks.map((entry) => String(entry)) : fallback.review.risks,
    },
    complexity: {
      estimatedTimeComplexity: String(complexity.estimatedTimeComplexity || fallback.complexity.estimatedTimeComplexity).trim(),
      estimatedSpaceComplexity: String(complexity.estimatedSpaceComplexity || fallback.complexity.estimatedSpaceComplexity).trim(),
      confidence: String(complexity.confidence || fallback.complexity.confidence).trim(),
      explanation: String(complexity.explanation || fallback.complexity.explanation).trim(),
    },
    debuggingHints: Array.isArray(raw.debuggingHints) ? raw.debuggingHints.map((entry) => String(entry)) : fallback.debuggingHints,
    optimizationHints: Array.isArray(raw.optimizationHints) ? raw.optimizationHints.map((entry) => String(entry)) : fallback.optimizationHints,
  };
}

export async function reviewCode({ sourceCode, language, questionDescription, useAi = true } = {}) {
  if (!sourceCode || !String(sourceCode).trim()) {
    throw new Error('sourceCode is required');
  }

  if (!useAi) {
    return normalizePayload(buildFallbackPayload());
  }

  try {
    const prompt = promptService.renderPrompt({
      key: 'coding.review',
      version: 'v1',
      values: {
        language: String(language || 'unknown').trim(),
        questionDescription: String(questionDescription || '').trim(),
        sourceCode: String(sourceCode).trim(),
      },
    });

    const aiResult = await aiService.request({
      prompt,
      temperature: 0.3,
      maxTokens: 700,
      metadata: {
        route: 'coding.review',
        language: String(language || 'unknown').trim(),
      },
    });

    const parsed = safeJsonParse(aiResult?.text || aiResult?.raw || '{}');
    if (parsed.error || !parsed.data || typeof parsed.data !== 'object') {
      return normalizePayload(buildFallbackPayload());
    }

    return normalizePayload(parsed.data);
  } catch (err) {
    console.warn('Coding review fallback triggered', err);
    return normalizePayload(buildFallbackPayload());
  }
}

export async function optimizeCode({ sourceCode, language, questionDescription, useAi = true } = {}) {
  if (!sourceCode || !String(sourceCode).trim()) {
    throw new Error('sourceCode is required');
  }

  if (!useAi) {
    return normalizePayload(buildFallbackPayload());
  }

  try {
    const prompt = promptService.renderPrompt({
      key: 'coding.optimize',
      version: 'v1',
      values: {
        language: String(language || 'unknown').trim(),
        questionDescription: String(questionDescription || '').trim(),
        sourceCode: String(sourceCode).trim(),
      },
    });

    const aiResult = await aiService.request({
      prompt,
      temperature: 0.3,
      maxTokens: 700,
      metadata: {
        route: 'coding.optimize',
        language: String(language || 'unknown').trim(),
      },
    });

    const parsed = safeJsonParse(aiResult?.text || aiResult?.raw || '{}');
    if (parsed.error || !parsed.data || typeof parsed.data !== 'object') {
      return normalizePayload(buildFallbackPayload());
    }

    return normalizePayload(parsed.data);
  } catch (err) {
    console.warn('Coding optimize fallback triggered', err);
    return normalizePayload(buildFallbackPayload());
  }
}
