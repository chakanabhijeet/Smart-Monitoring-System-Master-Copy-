import { z } from "zod";

export const tenantSchema = z.object({
  tenantName: z.string().trim().min(3, "Enter the tenant name"),

  tenantCode: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Tenant code must be at least 2 characters")
    .max(30, "Tenant code must be 30 characters or less")
    .regex(
      /^[a-z0-9_-]+$/,
      "Use only letters, numbers, - and _ (no spaces)"
    ),

  address: z.string().trim().max(200, "Address is too long"),
});