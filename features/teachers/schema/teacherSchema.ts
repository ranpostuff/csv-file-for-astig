import { z } from "zod";

export const createTeacherSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),

  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),

  firstName: z.string().trim().min(1, "First name is required."),

  middleName: z.string().trim().nullable(),

  lastName: z.string().trim().min(1, "Last name is required."),

  extension: z.string().trim().nullable(),

  address: z.string().trim().min(1, "Address is required."),

  dateOfBirth: z.string().min(1, "Date of birth is required."),

  profilePictureUrl: z.string().nullable(),
});

export const updateTeacherSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required."),
  extension: z.string().optional(),
  address: z.string().min(1, "Address is required."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  profilePictureUrl: z.string().nullable(),
});

export type CreateTeacherFormValues = z.infer<typeof createTeacherSchema>;

export type UpdateTeacherFormValues = z.infer<typeof updateTeacherSchema>;
