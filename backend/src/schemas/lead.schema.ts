import { LeadStatus, SalesPerson } from "@prisma/client";
import { z } from "zod";

export const leadIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const createLeadSchema = z.object({
  name: z.string().min(1),
  companyName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(1),
  source: z.string().min(1),
  assignedTo: z.nativeEnum(SalesPerson).optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  dealValue: z.number().finite(),
});

export const updateLeadSchema = z
  .object({
    name: z.string().min(1).optional(),
    companyName: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phoneNumber: z.string().min(1).optional(),
    source: z.string().min(1).optional(),
    assignedTo: z.nativeEnum(SalesPerson).optional(),
    status: z.nativeEnum(LeadStatus).optional(),
    dealValue: z.number().finite().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "At least one field must be provided",
  });

export const updateLeadStatusSchema = z.object({
  status: z.nativeEnum(LeadStatus),
});
