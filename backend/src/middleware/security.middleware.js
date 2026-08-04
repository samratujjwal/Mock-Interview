import helmet from "helmet";
import AppError from "../utils/appError.js";

export const helmetMiddleware = helmet();

const configuredOrigins = String(
  process.env.CORS_ORIGINS ||
    process.env.FRONTEND_URL ||
    "http://localhost:5173",
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

export const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser tools (curl/Postman) which send no Origin header.
    if (!origin || configuredOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(
      new AppError(`Origin ${origin} is not whitelisted by CORS policy.`, 403),
    );
  },
  credentials: true,
};

const MONGO_OPERATOR_KEY = /^\$|\./;
const SCRIPT_TAG = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const HTML_TAG = /<[^>]*>/g;

function sanitizeString(value) {
  return value.replace(SCRIPT_TAG, "").replace(HTML_TAG, "");
}

function sanitizeValue(value) {
  if (typeof value === "string") return sanitizeString(value);

  if (Array.isArray(value)) return value.map(sanitizeValue);

  if (value && typeof value === "object") {
    const clean = {};
    for (const [key, val] of Object.entries(value)) {
      if (MONGO_OPERATOR_KEY.test(key)) continue;
      clean[key] = sanitizeValue(val);
    }
    return clean;
  }

  return value;
}

export function sanitizeInput(req, res, next) {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.query) req.query = sanitizeValue(req.query);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
}
