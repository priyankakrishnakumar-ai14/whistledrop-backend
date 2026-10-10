import { z } from "zod";

export const registerModeratorSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters"),
});

export const loginModeratorSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type RegisterModeratorInput = z.infer<
  typeof registerModeratorSchema
>;

export type LoginModeratorInput = z.infer<
  typeof loginModeratorSchema
>;