// import { AnyZodObject } from 'zod';

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      if (!schema) return next();
      // Allow schemas that validate body, query, params together
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      // ZodError -> return standardized error response
      const z = err;
      const errors = (z?.errors || []).map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return res
        .status(422)
        .json({ success: false, message: "Validation failed", errors });
    }
  };
};
