import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET ?? "";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

export interface AuthenticatedRequest extends Request {
  moderator?: {
    id: string;
    email: string;
    role: string;
  };
}

export function authenticateModerator(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string" || !decoded.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    req.moderator = {
      id: decoded.sub,
      email: typeof decoded.email === "string" ? decoded.email : "",
      role: typeof decoded.role === "string" ? decoded.role : "",
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
}