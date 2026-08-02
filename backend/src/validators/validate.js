import AppError from "../utils/AppError.js";

function formatZodErrors(zodError) {
  return zodError.issues.map((issue) => ({
    field: issue.path.length ? issue.path.join(".") : "(root)",
    message: issue.message,
  }));
}

export default function validate(schemas = {}) {
  const targets = ["body", "query", "params", "headers", "files"];

  return (req, res, next) => {
    for (const target of targets) {
      const schema = schemas[target];
      if (!schema) continue;

      const result = schema.safeParse(req[target]);
      if (!result.success) {
        return next(
          new AppError(
            "Validation failed.",
            422,
            formatZodErrors(result.error),
          ),
        );
      }

      req[target] = result.data;
    }

    return next();
  };
}
