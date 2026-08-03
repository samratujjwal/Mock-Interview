import { aiService } from '../ai/ai.service.js';
import { safeJsonParse } from '../ai/response.service.js';
import { promptService } from '../prompt.service.js';

function clampScore(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function normalizeEvaluation(raw = {}) {
  const fallback = {
    overallScore: 0,
    technicalScore: 0,
    communicationScore: 0,
    confidence: 0,
    strengths: [],
    weaknesses: [],
    feedback: 'Evaluation could not be generated.',
    hiddenSignals: {},
  };

  if (!raw || typeof raw !== 'object') return fallback;

  return {
    overallScore: clampScore(raw.overallScore ?? raw.score ?? 0),
    technicalScore: clampScore(raw.technicalScore ?? 0),
    communicationScore: clampScore(raw.communicationScore ?? 0),
    confidence: clampScore(raw.confidence ?? 0),
    strengths: Array.isArray(raw.strengths) ? raw.strengths.map((entry) => String(entry)) : [],
    weaknesses: Array.isArray(raw.weaknesses) ? raw.weaknesses.map((entry) => String(entry)) : [],
    feedback: String(raw.feedback || 'Evaluation generated successfully.').trim(),
    hiddenSignals: raw.hiddenSignals && typeof raw.hiddenSignals === 'object' ? raw.hiddenSignals : {},
  };
}

export async function evaluateInterviewAnswer({
  role,
  type,
  difficulty,
  companyMode,
  personality,
  question,
  answer,
  memory = {},
} = {}) {
  try {
    const prompt = promptService.renderPrompt({
      key: 'interview.answer.evaluation',
      version: 'v1',
      values: {
        role: String(role || 'General Candidate').trim(),
        type: String(type || 'technical').trim(),
        difficulty: String(difficulty || 'medium').trim(),
        companyMode: String(companyMode || 'product').trim(),
        personality: String(personality || 'professional').trim(),
        question: String(question || '').trim(),
        answer: String(answer || '').trim(),
        memory: typeof memory === 'object' ? JSON.stringify(memory) : String(memory || ''),
      },
    });

    const aiResult = await aiService.request({
      prompt,
      temperature: 0.3,
      maxTokens: 600,
      metadata: {
        route: 'interview.answer.evaluation',
        question: String(question || '').trim(),
      },
    });

    const parsed = safeJsonParse(aiResult?.text || aiResult?.raw || '{}');
    if (parsed.error || !parsed.data || typeof parsed.data !== 'object') {
      return normalizeEvaluation({
        overallScore: 50,
        technicalScore: 50,
        communicationScore: 50,
        confidence: 50,
        strengths: ['Answer captured and queued for review.'],
        weaknesses: ['AI evaluation fell back to a safe default.'],
        feedback: 'AI evaluation is temporarily unavailable; scores are placeholder values.',
        hiddenSignals: { fallback: true },
      });
    }

    return normalizeEvaluation(parsed.data);
  } catch (err) {
    console.warn('Answer evaluation fallback triggered', err);
    return normalizeEvaluation({
      overallScore: 50,
      technicalScore: 50,
      communicationScore: 50,
      confidence: 50,
      strengths: ['Answer captured and queued for review.'],
      weaknesses: ['AI evaluation fell back to a safe default.'],
      feedback: 'AI evaluation is temporarily unavailable; scores are placeholder values.',
      hiddenSignals: { fallback: true },
    });
  }
}
