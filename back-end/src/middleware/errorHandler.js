import { config } from "../config/config.js";

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path}`, err);

  // Prisma known errors
  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] ?? "field";
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ success: false, message: "Record not found" });
  }

  if (err.code === "P2003") {
    return res.status(400).json({
      success: false,
      message: "Related record not found",
    });
  }

  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
    ...config.isDev && { stack: err.stack },
  });
};

/**
 * Utility to create a quick HTTP error.
 */
export const createError = (message, statusCode = 500) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};