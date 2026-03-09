export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(422).json({ success: false, message: "Validation failed", errors });
  }
  req.body = result.data; // coerced & defaulted values
  next();
};

// Middleware to validate query parameters.