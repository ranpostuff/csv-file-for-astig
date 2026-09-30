import { z } from "zod";

export const studentSchema = z.object({
  lrn: z.string().trim().min(1, "LRN is required."),

  firstName: z.string().trim().min(1, "First name is required."),

  middleName: z.string().trim().optional().or(z.literal("")),

  lastName: z.string().trim().min(1, "Last name is required."),

  extension: z.string().trim().optional().or(z.literal("")),

  parentMobileNo: z.string().trim().min(1, "Parent mobile number is required."),

  parentEmail: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  studentPicUrl: z.string().trim().optional().or(z.literal("")),

  sectionId: z.number().int().positive("Please select a section."),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
