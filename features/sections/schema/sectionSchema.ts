import { z } from "zod";

export const sectionSchema = z.object({
  name: z.string().trim().min(1, "Section name is required"),

  assignedTeacherId: z.string().min(1, "Assigned teacher is required"),

  gradeId: z.number().min(1, "Grade is required"),
});

export type SectionFormValues = z.infer<typeof sectionSchema>;
