import { Request, Response, NextFunction } from "express";
import {
  registerModerator,
  loginModerator,
} from "../services/auth.service";
import {
  registerModeratorSchema,
  loginModeratorSchema,
} from "../validators/auth.validator";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = registerModeratorSchema.parse(req.body);

    const moderator = await registerModerator(input);

    return res.status(201).json({
      success: true,
      message: "Moderator registered successfully",
      data: moderator,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = loginModeratorSchema.parse(req.body);

    const result = await loginModerator(input);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}