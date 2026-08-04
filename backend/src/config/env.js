import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5000),

  MONGO_URI: z.string().optional(),
  JWT_SECRET: z
    .string({ required_error: "JWT_SECRET is required." })
    .min(16, "JWT_SECRET should be at least 16 characters."),
  JWT_REFRESH_SECRET: z
    .string({ required_error: "JWT_REFRESH_SECRET is required." })
    .min(16, "JWT_REFRESH_SECRET should be at least 16 characters."),

  JWT_ISSUER: z.string().default("mock-interview-platform"),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive().default(12),

  FRONTEND_URL: z.string().default("http://localhost:5173"),
  CORS_ORIGINS: z.string().optional(),

  GEMINI_API_KEY: z.string().optional(),
  GEMINI_API_URL: z.string().optional(),
  GEMINI_DEFAULT_MODEL: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  GROQ_API_URL: z.string().optional(),
  GROQ_DEFAULT_MODEL: z.string().optional(),
  OPENROUTER_API_KEY: z.string().optional(),
  OPENROUTER_API_URL: z.string().optional(),
  OPENROUTER_DEFAULT_MODEL: z.string().optional(),
  AI_PROVIDER_PRIMARY: z.string().optional(),
  AI_REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().optional(),
  AI_REQUEST_RETRY_ATTEMPTS: z.coerce.number().int().nonnegative().optional(),
  AI_RESUME_MODEL: z.string().optional(),
  AI_RESUME_WEAKNESS_MODEL: z.string().optional(),
  AI_JD_ANALYSIS_MODEL: z.string().optional(),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  RESUME_MAX_SIZE_BYTES: z.coerce.number().int().positive().optional(),
  AVATAR_MAX_SIZE_BYTES: z.coerce.number().int().positive().optional(),
  UPLOAD_MAX_SIZE_BYTES: z.coerce.number().int().positive().optional(),

  JUDGE0_URL: z.string().optional(),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error(
    "\nEnvironment validation failed. Fix the following and restart:\n",
  );
  for (const issue of result.error.issues) {
    console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
  }
  console.error("\nSee backend/.env.example for the full list of variables.\n");
  process.exit(1);
}

const optionalAiKeys = ["GEMINI_API_KEY", "GROQ_API_KEY", "OPENROUTER_API_KEY"];
const missingAiKeys = optionalAiKeys.filter((key) => !result.data[key]);
if (missingAiKeys.length === optionalAiKeys.length) {
  console.warn(
    `No AI provider API keys set (${optionalAiKeys.join(", ")}) — AI features will fail at runtime.`,
  );
}

export const env = Object.freeze(result.data);
export default env;
