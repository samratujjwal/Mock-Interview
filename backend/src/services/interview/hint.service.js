import { aiService } from "../ai/ai.service.js";
import { safeJsonParse } from "../ai/response.service.js";
import { promptService } from "../prompt.service.js";

const MAX_HINT_LEVEL = 3;

function safeText(value) {
  return String(value || "").trim();
}

function buildFallbackHint(level, topic) {
  const nudge = {
    1: `Think about how ${topic || "this topic"} is typically approached — what's the core concept at play here?`,
    2: `Focus on the specific mechanism or trade-off involved in ${topic || "this problem"} — what changes if you consider that?`,
    3: `You're close — walk through it step by step from the concept you just mentioned and see where it leads.`,
  };
  return nudge[level] || nudge[1];
}

export function getMaxHintLevel() {
  return MAX_HINT_LEVEL;
}

export async function generateHint({
  role = "General Candidate",
  type = "technical",
  difficulty = "medium",
  currentQuestion = "",
  answer = "",
  topic = "general",
  hintLevel = 1,
} = {}) {
  const level = Math.min(Math.max(Number(hintLevel) || 1, 1), MAX_HINT_LEVEL);

  const prompt = promptService.renderPrompt({
    key: "interview.hint",
    version: "v1",
    values: {
      role,
      type,
      difficulty,
      currentQuestion: safeText(currentQuestion),
      answer: safeText(answer),
      topic: safeText(topic || "general"),
      hintLevel: level,
    },
  });

  try {
    const aiResult = await aiService.request({
      prompt,
      temperature: 0.4,
      maxTokens: 150,
      metadata: { route: "interview.hint", hintLevel: level },
    });

    const parsed = safeJsonParse(aiResult?.text || aiResult?.raw || "{}");
    const hintText = safeText(parsed?.data?.hint);
    if (parsed.error || !hintText) {
      return {
        level,
        text: buildFallbackHint(level, topic),
        source: "fallback",
      };
    }

    return { level, text: hintText, source: "ai" };
  } catch (err) {
    console.warn("Hint generation failed, using deterministic fallback", err);
    return { level, text: buildFallbackHint(level, topic), source: "fallback" };
  }
}
