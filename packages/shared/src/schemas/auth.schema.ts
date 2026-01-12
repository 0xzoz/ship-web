import { z } from "zod";

const weakPasswords = new Set([
  "password",
  "password1",
  "password123",
  "12345678",
  "qwerty123",
  "letmein",
  "welcome",
  "iloveyou",
  "admin123",
]);

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .refine((value) => !weakPasswords.has(value.toLowerCase()), {
    message: "Password is too common",
  });

export const signupSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  name: z.string().min(1).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
