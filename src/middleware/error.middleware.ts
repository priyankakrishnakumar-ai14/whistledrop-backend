import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (error instanceof Error) {
    if (error.message === "MODERATOR_ALREADY_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Moderator account already exists",
      });
    }

    if (error.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (error.message === "Report not found") {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    if (error.message.startsWith("Invalid status transition")) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}