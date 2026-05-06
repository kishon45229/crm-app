import { z } from "zod";

import { LEAD_STATUSES } from "./types";

export const createLeadSchema = z.object({
  leadName: z
    .string()
    .min(1, "Lead name is required")
    .max(100, "Lead name must be less than 100 characters"),
  companyName: z
    .string()
    .max(100, "Company name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string(),
  leadSource: z.string(),
  assignedSalesperson: z.string(),
  status: z.enum(LEAD_STATUSES),
  estimatedDealValue: z
    .string()
    .max(15, "Estimated deal value must be less than 15 characters")
    .refine(
      (val) => !val || (!isNaN(Number(val)) && Number(val) >= 0),
      "Estimated deal value must be a positive number",
    ),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
