import { z } from "zod";

// Add-role form
export const roleSchema = z.object({
  roleName: z
    .string()
    .trim()
    .min(2, "Role name must be at least 2 characters")
    .max(50, "Role name must be 50 characters or less")
    .regex(
      /^[A-Za-z0-9][A-Za-z0-9 _&-]*$/,
      "Use letters, numbers, spaces, - _ and & only"
    ),
});

// Delete-by-ID form
export const deleteByIdSchema = z.object({
  roleId: z
    .string()
    .trim()
    .regex(/^\d+$/, "Enter the role ID (numbers only)")
    .refine((value) => Number(value) > 0, "Role ID must be greater than 0"),
});