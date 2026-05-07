import type { Lead, LeadStatus } from "./types";

export type LeadDraft = {
  leadName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  leadSource: string;
  assignedSalesperson: string;
  status: LeadStatus;
  estimatedDealValue: string;
};

export function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function emptyDraft(): LeadDraft {
  return {
    leadName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    leadSource: "",
    assignedSalesperson: "",
    status: "New",
    estimatedDealValue: "",
  };
}

export function toDraft(lead: Lead): LeadDraft {
  return {
    leadName: lead.leadName,
    companyName: lead.companyName,
    email: lead.email,
    phoneNumber: lead.phoneNumber,
    leadSource: lead.leadSource,
    assignedSalesperson: lead.assignedSalesperson,
    status: lead.status,
    estimatedDealValue:
      lead.estimatedDealValue === 0 ? "" : String(lead.estimatedDealValue),
  };
}

export function draftToPatch(
  draft: LeadDraft,
): Partial<Omit<Lead, "id" | "createdDate">> {
  return {
    leadName: draft.leadName.trim(),
    companyName: draft.companyName.trim(),
    email: draft.email.trim(),
    phoneNumber: draft.phoneNumber.trim(),
    leadSource: draft.leadSource.trim(),
    assignedSalesperson: draft.assignedSalesperson.trim(),
    status: draft.status,
    estimatedDealValue: Number(draft.estimatedDealValue || 0),
  };
}
