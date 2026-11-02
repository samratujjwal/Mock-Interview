import {
  GeminiProvider,
  GroqProvider,
  OpenRouterProvider,
} from './providers.js';

const DEFAULT_PROVIDER_ORDER = ['gemini', 'groq', 'openrouter'];
const DEFAULT_TIMEOUT_MS = 120000;
const DEFAULT_RETRY_ATTEMPTS = 2;

function readEnvArray(variableName, fallback = []) {
  const raw = process.env[variableName];
  if (!raw) return fallback;
  return raw
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function createProviderInstances(timeoutMs) {
  return [
    new GeminiProvider({
      apiKey: process.env.GEMINI_API_KEY,
      endpoint: process.env.GEMINI_API_URL,
      defaultModel: process.env.GEMINI_DEFAULT_MODEL,
      timeoutMs,
    }),
    new GroqProvider({
      apiKey: process.env.GROQ_API_KEY,
      endpoint: process.env.GROQ_API_URL,
      defaultModel: process.env.GROQ_DEFAULT_MODEL,
      timeoutMs,
    }),
    new OpenRouterProvider({
      apiKey: process.env.OPENROUTER_API_KEY,
      endpoint: process.env.OPENROUTER_API_URL,
      defaultModel: process.env.OPENROUTER_DEFAULT_MODEL,
      timeoutMs,
    }),
  ];
}

function getPreferredProviders(allProviders, requestedProviderName, fallbackOrder) {
  const normalizedRequest = requestedProviderName ? String(requestedProviderName).trim().toLowerCase() : null;
  const availableProviders = allProviders.filter((provider) => provider.isAvailable());
  if (!normalizedRequest) {
    return fallbackOrder
      .map((name) => availableProviders.find((provider) => provider.name === name))
      .filter(Boolean);
  }

  const requested = availableProviders.find((provider) => provider.name === normalizedRequest);
  if (!requested) {
    return getPreferredProviders(allProviders, null, fallbackOrder);
  }

  const ordered = [requested, ...availableProviders.filter((provider) => provider.name !== requested.name)];
  return ordered;
}

export class AIService {
  constructor(options = {}) {
    const timeoutMs = Number.parseInt(process.env.AI_REQUEST_TIMEOUT_MS || '', 10) || DEFAULT_TIMEOUT_MS;
    const retryAttempts = Number.parseInt(process.env.AI_REQUEST_RETRY_ATTEMPTS || '', 10) || DEFAULT_RETRY_ATTEMPTS;
    const primary = String(process.env.AI_PROVIDER_PRIMARY || 'gemini').trim().toLowerCase();
    const fallbackOrder = readEnvArray('AI_PROVIDER_FALLBACKS', DEFAULT_PROVIDER_ORDER);

    this.providers = createProviderInstances(timeoutMs);
    this.primary = primary;
    this.fallbackOrder = Array.from(new Set([primary, ...fallbackOrder, ...DEFAULT_PROVIDER_ORDER]));
    this.timeoutMs = timeoutMs;
    this.retryAttempts = Math.max(1, retryAttempts);
  }

  getProvider(name) {
    if (!name) return null;
    return this.providers.find((provider) => provider.name === String(name).trim().toLowerCase()) || null;
  }

  getAvailableProviders() {
    return this.providers.filter((provider) => provider.isAvailable());
  }

  async request({ prompt, model, temperature, maxTokens, provider: requestedProvider, userId, metadata } = {}) {
    if (!prompt || !String(prompt).trim()) {
      throw new Error('AI request must include a non-empty prompt');
    }

    const availableProviders = this.getAvailableProviders();
    if (availableProviders.length === 0) {
      throw new Error('No configured AI providers are available');
    }

    const orderedProviders = getPreferredProviders(availableProviders, requestedProvider || this.primary, this.fallbackOrder);
    const errors = [];

    for (const provider of orderedProviders) {
      for (let attempt = 1; attempt <= this.retryAttempts; attempt += 1) {
        try {
          const result = await provider.send({ prompt, model, temperature, maxTokens, metadata });
          console.info(`AIService: ${provider.name} succeeded in attempt ${attempt} (${result.latencyMs}ms)`);
          return {
            ...result,
            provider: provider.name,
            prompt: String(prompt).trim(),
            model: result.model,
            userId,
            metadata,
          };
        } catch (err) {
          errors.push({ provider: provider.name, attempt, message: err.message });
          if (attempt < this.retryAttempts && provider.isRetryableError(err)) {
            console.warn(`AIService: retrying ${provider.name} attempt ${attempt + 1} after error: ${err.message}`);
            continue;
          }
          console.warn(`AIService: ${provider.name} failed: ${err.message}`);
          break;
        }
      }
    }

    const message = errors.length
      ? `AI request failed for all providers. Errors: ${errors.map((entry) => `[${entry.provider} attempt ${entry.attempt}] ${entry.message}`).join('; ')}`
      : 'AI request failed for all providers.';
    throw new Error(message);
  }
}

export const aiService = new AIService();
