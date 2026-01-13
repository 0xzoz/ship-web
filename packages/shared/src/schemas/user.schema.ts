import { z } from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
