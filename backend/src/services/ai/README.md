# AI Service Layer

Abstract LLM provider integration (Gemini primary, Groq / OpenRouter fallbacks), prompt execution, and response parsing.

This module exposes an `AIService` abstraction with provider implementations for Gemini, Groq, and OpenRouter. The service selects a configured primary provider, retries transient failures, and falls back transparently to a secondary provider when needed.

Environment variables:

- `AI_PROVIDER_PRIMARY`: Preferred provider name (`gemini`, `groq`, or `openrouter`). Defaults to `gemini`.
- `AI_PROVIDER_FALLBACKS`: Comma-separated fallback provider order.
- `AI_REQUEST_TIMEOUT_MS`: Request timeout in milliseconds. Defaults to `120000`.
- `AI_REQUEST_RETRY_ATTEMPTS`: Retry count for transient provider failures. Defaults to `2`.
- `GEMINI_API_KEY`, `GEMINI_API_URL`, `GEMINI_DEFAULT_MODEL`
- `GROQ_API_KEY`, `GROQ_API_URL`, `GROQ_DEFAULT_MODEL`
- `OPENROUTER_API_KEY`, `OPENROUTER_API_URL`, `OPENROUTER_DEFAULT_MODEL`

The AI service returns normalized completion results with provider metadata, latency, usage, and a safe JSON parse of the generated text when applicable. This helps downstream controllers handle structured or unstructured outputs reliably.
