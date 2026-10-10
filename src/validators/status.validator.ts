import { z } from "zod";

export const updateStatusSchema = z.object({
  status: z.enum([
    "UNDER_REVIEW",
    "RESOLVED",
    "DISMISSED",
  ]),
  message: z
    .string()
    .trim()
    .max(1000, "Message must not exceed 1000 characters")
    .optional(),
});

export type UpdateStatusInput = z.infer<
  typeof updateStatusSchema
>;