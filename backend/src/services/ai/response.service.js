function isString(value) {
  return typeof value === 'string' || value instanceof String;
}

function findFirstJsonCandidate(text) {
  if (!isString(text)) return null;

  const openers = ['{', '['];
  const closers = { '{': '}', '[': ']' };

  for (let start = 0; start < text.length; start += 1) {
    const opener = text[start];
    if (!openers.includes(opener)) continue;

    let depth = 1;
    let inString = false;
    let escape = false;
    const closer = closers[opener];

    for (let i = start + 1; i < text.length; i += 1) {
      const char = text[i];
      if (escape) {
        escape = false;
        continue;
      }

      if (char === '\\') {
        escape = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        continue;
      }

      if (inString) {
        continue;
      }

      if (char === opener) {
        depth += 1;
      } else if (char === closer) {
        depth -= 1;
        if (depth === 0) {
          return text.slice(start, i + 1);
        }
      }
    }
  }

  return null;
}

function normalizeCandidateText(text) {
  if (!isString(text)) return '';
  return text.trim();
}

export function safeJsonParse(input) {
  const rawText = normalizeCandidateText(input);
  if (!rawText) {
    return { data: null, error: 'No JSON text provided' };
  }

  const tryParse = (candidate) => {
    try {
      return { data: JSON.parse(candidate), error: null };
    } catch (err) {
      return { data: null, error: String(err.message || 'Invalid JSON') };
    }
  };

  const firstAttempt = tryParse(rawText);
  if (firstAttempt.data !== null) {
    return firstAttempt;
  }

  const candidate = findFirstJsonCandidate(rawText);
  if (!candidate) {
    return { data: null, error: 'No JSON object or array found in text' };
  }

  const secondAttempt = tryParse(candidate);
  if (secondAttempt.data !== null) {
    return secondAttempt;
  }

  return {
    data: null,
    error: `Failed to parse JSON from extracted candidate: ${secondAttempt.error}`,
  };
}

export function formatAIResponse(aiResult) {
  if (!aiResult || typeof aiResult !== 'object') {
    return {
      text: null,
      provider: null,
      model: null,
      usage: null,
      latencyMs: null,
      parsedJson: null,
      jsonParseError: 'No AI result provided',
      raw: aiResult,
    };
  }

  const text = isString(aiResult.text) ? aiResult.text.trim() : null;
  const raw = aiResult.raw || aiResult;
  const parsed = text ? safeJsonParse(text) : { data: null, error: 'No text returned from AI provider' };

  return {
    provider: aiResult.provider || null,
    model: aiResult.model || null,
    text,
    usage: aiResult.usage || null,
    latencyMs: aiResult.latencyMs || null,
    parsedJson: parsed.data,
    jsonParseError: parsed.error,
    raw,
  };
}
