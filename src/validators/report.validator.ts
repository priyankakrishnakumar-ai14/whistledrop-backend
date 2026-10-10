import { z } from "zod";

export const createReportSchema = z.object({
  category: z.enum([
    "SECURITY",
    "HARASSMENT",
    "CORRUPTION",
    "TECHNICAL",
    "OTHER",
  ]),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description must not exceed 5000 characters"),

  evidenceUrl: z
    .string()
    .url("Evidence URL must be a valid URL")
    .optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;