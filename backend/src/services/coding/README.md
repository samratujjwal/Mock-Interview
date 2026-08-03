# Coding Execution Service

Judge0 CE integration for sandboxed code compilation, test runner execution, and complexity analysis.

## What is included

- language mapping for common interview languages (JavaScript, Python, Java, C/C++, C#, Go, Ruby, PHP, Swift, Kotlin, TypeScript)
- base64-encoded submission payloads compatible with Judge0 CE
- submission polling for completion state
- rate-limit protection to avoid hammering the execution endpoint

## Environment variables

- `JUDGE0_URL`: Judge0 CE base URL (required for live execution)
- `JUDGE0_API_KEY`: optional bearer token when your Judge0 deployment requires auth
- `JUDGE0_TIMEOUT_MS`: optional execution timeout in milliseconds
- `JUDGE0_POLL_INTERVAL_MS`: optional polling interval in milliseconds
- `JUDGE0_MAX_ATTEMPTS`: optional maximum number of polling attempts
- `JUDGE0_RATE_LIMIT_PER_MINUTE`: optional submission rate limit

## Usage

```js
import { judge0Service } from "./judge0.service.js";

const result = await judge0Service.runSubmission({
  sourceCode: "function add(a, b) { return a + b; }",
  language: "javascript",
  stdin: "",
  expectedOutput: "",
});
```
