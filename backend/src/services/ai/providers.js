const DEFAULT_GEMINI_BASE_URL = 'https://gemini.googleapis.com/v1beta2/models';
const DEFAULT_GROQ_ENDPOINT = 'https://api.groq.io/v1/outputs';
const DEFAULT_OPENROUTER_ENDPOINT = 'https://api.openrouter.ai/v1/chat/completions';

const DEFAULT_MODEL_MAP = {
  gemini: 'gemini-1.5',
  groq: 'groq-1-mini',
  openrouter: 'gpt-4o-mini',
};

function normalizeProviderName(name) {
  return String(name || '').trim().toLowerCase();
}

function toSafeString(value) {
  return value == null ? '' : String(value).trim();
}

function buildHeaders(apiKey) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

class AIProviderBase {
  constructor({ providerName, apiKey, endpoint, defaultModel, timeoutMs = 120000 }) {
    this.providerName = normalizeProviderName(providerName);
    this.apiKey = toSafeString(apiKey);
    this.endpoint = toSafeString(endpoint);
    this.defaultModel = toSafeString(defaultModel);
    this.timeoutMs = timeoutMs;
  }

  get name() {
    return this.providerName;
  }

  isAvailable() {
    return Boolean(this.apiKey && this.endpoint);
  }

  buildRequestBody({ prompt, model, temperature, maxTokens, metadata }) {
    throw new Error('buildRequestBody must be implemented by providers');
  }

  buildRequestUrl({ model }) {
    throw new Error('buildRequestUrl must be implemented by providers');
  }

  parseResponse(responseBody) {
    throw new Error('parseResponse must be implemented by providers');
  }

  normalizeResponse(parsed, responseBody, latencyMs) {
    return {
      provider: this.name,
      model: parsed.model || this.defaultModel,
      text: parsed.text || '',
      usage: parsed.usage || {},
      raw: responseBody,
      latencyMs,
    };
  }

  async send({ prompt, model, temperature = 0.2, maxTokens = 512, metadata } = {}) {
    if (!this.isAvailable()) {
      throw new Error(`${this.name} provider is not configured`);
    }

    const url = this.buildRequestUrl({ model });
    const body = this.buildRequestBody({ prompt, model, temperature, maxTokens, metadata });
    const headers = buildHeaders(this.apiKey);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const start = Date.now();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const latencyMs = Date.now() - start;
      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        const message = responseBody?.error?.message || response.statusText || 'Unknown error';
        throw new Error(`${this.name} request failed (${response.status}): ${message}`);
      }

      const parsed = this.parseResponse(responseBody);
      return this.normalizeResponse(parsed, responseBody, latencyMs);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`${this.name} request timed out after ${this.timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  isRetryableError(error) {
    if (!error || !error.message) return false;
    const message = String(error.message).toLowerCase();
    return [
      'timeout',
      'timed out',
      '503',
      '502',
      '504',
      '429',
      'failed to fetch',
      'network',
    ].some((fragment) => message.includes(fragment));
  }
}

export class GeminiProvider extends AIProviderBase {
  constructor(options = {}) {
    super({
      providerName: 'gemini',
      apiKey: options.apiKey,
      endpoint: options.endpoint || DEFAULT_GEMINI_BASE_URL,
      defaultModel: options.defaultModel || DEFAULT_MODEL_MAP.gemini,
      timeoutMs: options.timeoutMs,
    });
  }

  buildRequestUrl({ model }) {
    const resolvedModel = toSafeString(model) || this.defaultModel;
    return `${this.endpoint}/${resolvedModel}:generateText`;
  }

  buildRequestBody({ prompt, temperature, maxTokens }) {
    return {
      prompt: {
        text: prompt,
      },
      temperature,
      maxOutputTokens: maxTokens,
    };
  }

  parseResponse(responseBody) {
    const text = responseBody?.candidates?.[0]?.content
      || responseBody?.outputText
      || responseBody?.results?.[0]?.content
      || '';
    return {
      model: responseBody?.model || this.defaultModel,
      text,
      usage: responseBody?.usage || {},
    };
  }
}

export class GroqProvider extends AIProviderBase {
  constructor(options = {}) {
    super({
      providerName: 'groq',
      apiKey: options.apiKey,
      endpoint: options.endpoint || DEFAULT_GROQ_ENDPOINT,
      defaultModel: options.defaultModel || DEFAULT_MODEL_MAP.groq,
      timeoutMs: options.timeoutMs,
    });
  }

  buildRequestUrl() {
    return this.endpoint;
  }

  buildRequestBody({ prompt, model, temperature, maxTokens }) {
    return {
      model: toSafeString(model) || this.defaultModel,
      input: prompt,
      temperature,
      max_output_tokens: maxTokens,
    };
  }

  parseResponse(responseBody) {
    const output = responseBody?.output;
    let text = '';

    if (typeof output === 'string') {
      text = output;
    } else if (Array.isArray(output)) {
      text = output.map((item) => (typeof item === 'string' ? item : item?.content || '')).join(' ');
    } else if (output?.[0]?.content) {
      text = Array.isArray(output[0].content)
        ? output[0].content.map((chunk) => chunk?.text || '').join(' ')
        : output[0].content;
    }

    return {
      model: responseBody?.model || this.defaultModel,
      text: text.trim(),
      usage: responseBody?.usage || {},
    };
  }
}

export class OpenRouterProvider extends AIProviderBase {
  constructor(options = {}) {
    super({
      providerName: 'openrouter',
      apiKey: options.apiKey,
      endpoint: options.endpoint || DEFAULT_OPENROUTER_ENDPOINT,
      defaultModel: options.defaultModel || DEFAULT_MODEL_MAP.openrouter,
      timeoutMs: options.timeoutMs,
    });
  }

  buildRequestUrl() {
    return this.endpoint;
  }

  buildRequestBody({ prompt, model, temperature, maxTokens }) {
    return {
      model: toSafeString(model) || this.defaultModel,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature,
      max_tokens: maxTokens,
    };
  }

  parseResponse(responseBody) {
    const text = responseBody?.choices?.[0]?.message?.content
      || responseBody?.output?.[0]?.content
      || responseBody?.output
      || '';

    return {
      model: responseBody?.model || this.defaultModel,
      text: typeof text === 'string' ? text : JSON.stringify(text),
      usage: responseBody?.usage || {},
    };
  }
}
