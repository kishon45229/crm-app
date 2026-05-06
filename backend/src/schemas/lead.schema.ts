import { LeadStatus, SalesPerson, LeadSource } from "@prisma/client";
import { z } from "zod";

export const leadIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const createLeadSchema = z.object({
  name: z.string().min(1).max(100),
  companyName: z.string().min(1).max(100).optional(),
  email: z.string().email(),
  phoneNumber: z.string().min(1).max(20),
  source: z.nativeEnum(LeadSource),
  assignedTo: z.nativeEnum(SalesPerson),
  status: z.nativeEnum(LeadStatus),
  dealValue: z.number().finite(),
});

export const updateLeadSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    companyName: z.string().min(1).max(100).optional(),
    email: z.string().email().max(100).optional(),
    phoneNumber: z.string().min(1).max(20).optional(),
    source: z.nativeEnum(LeadSource).optional(),
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

export const addLeadNoteSchema = z.object({
  leadId: z.string().uuid(),
  content: z.string().min(1).max(500),
  createdById: z.string(),
});
