import { z } from "zod";

export const gradeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Grade name is required.")
    .max(100, "Grade name must not exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters.")
    .optional()
    .or(z.literal("")),
});

export type GradeFormValues = z.infer<typeof gradeSchema>;
