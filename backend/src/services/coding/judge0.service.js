import { setTimeout as delay } from "node:timers/promises";

const DEFAULT_BASE_URL = process.env.JUDGE0_URL || "https://judge0-ce.p.rapidapi.com";
const DEFAULT_TIMEOUT_MS = Number.parseInt(process.env.JUDGE0_TIMEOUT_MS || "", 10) || 120000;
const DEFAULT_POLL_INTERVAL_MS = Number.parseInt(process.env.JUDGE0_POLL_INTERVAL_MS || "", 10) || 2000;
const DEFAULT_MAX_ATTEMPTS = Number.parseInt(process.env.JUDGE0_MAX_ATTEMPTS || "", 10) || 20;
const DEFAULT_RATE_LIMIT_PER_MINUTE = Number.parseInt(process.env.JUDGE0_RATE_LIMIT_PER_MINUTE || "", 10) || 20;

const LANGUAGE_IDS = {
  javascript: 63,
  js: 63,
  node: 63,
  python: 71,
  py: 71,
  java: 62,
  cpp: 54,
  cplusplus: 54,
  c: 50,
  csharp: 51,
  cs: 51,
  go: 60,
  golang: 60,
  ruby: 72,
  php: 68,
  swift: 83,
  kotlin: 78,
  typescript: 74,
  ts: 74,
};

function normalizeLanguageName(language) {
  return String(language || "").trim().toLowerCase();
}

function getBase64Content(value) {
  const text = value == null ? "" : String(value);
  return Buffer.from(text).toString("base64");
}

function decodeBase64Content(value) {
  if (!value) return "";
  return Buffer.from(String(value), "base64").toString("utf8");
}

export class Judge0Service {
  constructor(options = {}) {
    this.baseUrl = String(options.baseUrl || DEFAULT_BASE_URL).replace(/\/$/, "");
    this.timeoutMs = Number.isFinite(Number(options.timeoutMs))
      ? Number(options.timeoutMs)
      : DEFAULT_TIMEOUT_MS;
    this.pollIntervalMs = Number.isFinite(Number(options.pollIntervalMs))
      ? Number(options.pollIntervalMs)
      : DEFAULT_POLL_INTERVAL_MS;
    this.maxAttempts = Number.isFinite(Number(options.maxAttempts))
      ? Number(options.maxAttempts)
      : DEFAULT_MAX_ATTEMPTS;
    this.rateLimitPerMinute = Number.isFinite(Number(options.rateLimitPerMinute))
      ? Number(options.rateLimitPerMinute)
      : DEFAULT_RATE_LIMIT_PER_MINUTE;
    this.requestLog = [];
    this.apiKey = options.apiKey || process.env.JUDGE0_API_KEY || null;
  }

  enforceRateLimit() {
    const cutoff = Date.now() - 60_000;
    this.requestLog = this.requestLog.filter((timestamp) => timestamp >= cutoff);
    if (this.requestLog.length >= this.rateLimitPerMinute) {
      const message = `Judge0 rate limit exceeded (${this.rateLimitPerMinute} requests/minute)`;
      throw new Error(message);
    }
    this.requestLog.push(Date.now());
  }

  getLanguageId(language) {
    const normalized = normalizeLanguageName(language);
    return LANGUAGE_IDS[normalized] ?? null;
  }

    buildHeaders() {
    const headers = { "Content-Type": "application/json" };

    if (this.apiKey) {
      // Support both RapidAPI-hosted Judge0 proxies and self-hosted/cloud Judge0 instances.
      // If the baseUrl mentions rapidapi, prefer X-RapidAPI-Key; otherwise send an Authorization bearer token.
      if (this.baseUrl.includes("rapidapi.com") || process.env.JUDGE0_USE_RAPIDAPI === "true") {
        headers["X-RapidAPI-Key"] = String(this.apiKey);
        if (process.env.JUDGE0_RAPIDAPI_HOST) {
          headers["X-RapidAPI-Host"] = String(process.env.JUDGE0_RAPIDAPI_HOST);
        }
      } else {
        headers['Authorization'] = 'Bearer ' + String(this.apiKey);
      }
    }

    return headers;
  }

  async createSubmission(payload = {}) {
    const { sourceCode, language, stdin = "", expectedOutput = "", cpuTimeLimit = 2, memoryLimitKb = 256000 } = payload;

    if (!sourceCode || !String(sourceCode).trim()) {
      throw new Error("sourceCode is required");
    }

    const languageId = this.getLanguageId(language);
    if (!languageId) {
      throw new Error(`Unsupported language: ${language}`);
    }

    this.enforceRateLimit();

    const response = await fetch(`${this.baseUrl}/submissions?base64_encoded=true`, {
      method: "POST",
      headers: this.buildHeaders(),
      body: JSON.stringify({
        source_code: getBase64Content(sourceCode),
        language_id: languageId,
        stdin: getBase64Content(stdin),
        expected_output: getBase64Content(expectedOutput),
        cpu_time_limit: Number(cpuTimeLimit) || 2,
        wall_time_limit: Math.max(5, Number(cpuTimeLimit) || 2),
        memory_limit: Number(memoryLimitKb) || 256000,
        compile_output: "",
        stderr: "",
        stdout: "",
        base64_encoded: true,
      }),
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const message = body?.error || body?.message || response.statusText || "Judge0 submission failed";
      throw new Error(`Judge0 request failed (${response.status}): ${message}`);
    }

    return {
      token: body?.token || null,
      languageId,
      language: normalizeLanguageName(language),
      raw: body,
    };
  }

  async getSubmission(token) {
    if (!token) {
      throw new Error("Submission token is required");
    }

    this.enforceRateLimit();

    const response = await fetch(`${this.baseUrl}/submissions/${token}?base64_encoded=true`, {
      method: "GET",
      headers: this.buildHeaders(),
    });

    const body = await response.json().catch(() => null);
    if (!response.ok) {
      const message = body?.error || body?.message || response.statusText || "Judge0 status lookup failed";
      throw new Error(`Judge0 status lookup failed (${response.status}): ${message}`);
    }

    return this.normalizeSubmission(body);
  }

  async runSubmission(payload = {}) {
    const submission = await this.createSubmission(payload);
    if (!submission.token) {
      throw new Error("Judge0 did not return a submission token");
    }

    const result = await this.waitForCompletion(submission.token, payload);
    return {
      ...result,
      token: submission.token,
      languageId: submission.languageId,
      language: submission.language,
    };
  }

  async waitForCompletion(token, payload = {}) {
    const deadline = Date.now() + this.timeoutMs;
    let attempt = 0;

    while (Date.now() < deadline && attempt < this.maxAttempts) {
      const result = await this.getSubmission(token);
      if (result.status?.id >= 3) {
        return {
          ...result,
          ...payload,
        };
      }
      attempt += 1;
      await delay(this.pollIntervalMs);
    }

    const lastResult = await this.getSubmission(token).catch(() => null);
    return {
      ...(lastResult || {}),
      timedOut: true,
      ...payload,
    };
  }

  normalizeSubmission(body) {
    const status = body?.status || {};
    const stdout = decodeBase64Content(body?.stdout);
    const stderr = decodeBase64Content(body?.stderr);
    const compileOutput = decodeBase64Content(body?.compile_output);
    const expectedOutput = decodeBase64Content(body?.expected_output);
    const message = body?.message ? decodeBase64Content(body?.message) : "";

    return {
      token: body?.token || null,
      status: {
        id: Number(status?.id) || null,
        description: String(status?.description || "Unknown").trim(),
      },
      stdout,
      stderr,
      compileOutput,
      expectedOutput,
      message,
      time: body?.time ?? null,
      memory: body?.memory ?? null,
      createdAt: body?.created_at || null,
      finishedAt: body?.finished_at || null,
      raw: body,
    };
  }
}

export const judge0Service = new Judge0Service();


