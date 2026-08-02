import AppError from "../utils/AppError.js";

function normalizeError(err) {
  // Errors we threw on purpose
  if (err instanceof AppError) {
    return {
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    };
  }

  // Mongoose validation error -> 422 with field-level errors
  if (err.name === "ValidationError" && err.errors) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return { statusCode: 422, message: "Validation failed.", errors };
  }

  // Mongoose bad ObjectId -> 400
  if (err.name === "CastError") {
    return {
      statusCode: 400,
      message: "Invalid identifier.",
      errors: [{ field: err.path, message: `Invalid value for ${err.path}.` }],
    };
  }

  // Mongo duplicate key -> 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return {
      statusCode: 409,
      message: `${field} already in use.`,
      errors: [{ field, message: `This ${field} is already taken.` }],
    };
  }

  // JWT errors -> 401
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return {
      statusCode: 401,
      message: "Invalid or expired token.",
      errors: [],
    };
  }

  // Unknown/programming error -> generic 500, never leak details
  return {
    statusCode: 500,
    message: "Something went wrong. Please try again later.",
    errors: [],
  };
}

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  const { statusCode, message, errors } = normalizeError(err);

  // Always log full detail server-side (Rule 14). Pino structured logging
  // lands with T-007; console is the interim logger.
  if (statusCode >= 500) {
    console.error(`[${req.requestId}] ${req.method} ${req.originalUrl}`, err);
  } else {
    console.warn(
      `[${req.requestId}] ${req.method} ${req.originalUrl} -> ${statusCode} ${message}`,
    );
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    requestId: req.requestId,
  });
}
