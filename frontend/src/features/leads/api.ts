import { authedDelete, authedGet, authedPatch } from "@/features/auth/api";

import { LEAD_STATUSES, type Lead, type LeadNote, type LeadStatus } from "./types";

function nowIso(): string {
  return new Date().toISOString();
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function asIsoDate(value: unknown): string {
  const s = asString(value);
  if (!s) return nowIso();
  const parsed = Date.parse(s);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : nowIso();
}

function toLeadStatus(value: unknown): LeadStatus {
  const s = asString(value);
  return (LEAD_STATUSES as readonly string[]).includes(s)
    ? (s as LeadStatus)
    : "New";
}

function coerceLeadNote(raw: unknown): LeadNote | null {
  if (!raw || typeof raw !== "object") return null;
  const note = raw as Record<string, unknown>;
  const id = asString(note.id ?? note.noteId ?? note.note_id);
  if (!id) return null;
  const createdByRaw =
    note.createdBy && typeof note.createdBy === "object"
      ? (note.createdBy as Record<string, unknown>)
      : null;
  return {
    id,
    content: asString(note.content ?? note.note ?? ""),
    createdBy: asString(
      note.createdBy ??
        note.created_by ??
        createdByRaw?.userName ??
        createdByRaw?.email ??
        "",
    ),
    createdDate: asIsoDate(
      note.createdDate ?? note.created_date ?? note.createdAt,
    ),
  };
}

function coerceLead(raw: unknown): Lead | null {
  if (!raw || typeof raw !== "object") return null;
  const lead = raw as Record<string, unknown>;
  const id = asString(lead.id ?? lead.leadId ?? lead.lead_id);
  if (!id) return null;

  const notesRaw = lead.notes;
  const notes = Array.isArray(notesRaw)
    ? (notesRaw.map(coerceLeadNote).filter(Boolean) as LeadNote[])
    : [];

  return {
    id,
    leadName: asString(lead.leadName ?? lead.lead_name ?? lead.name ?? ""),
    companyName: asString(lead.companyName ?? lead.company_name ?? ""),
    email: asString(lead.email ?? ""),
    phoneNumber: asString(lead.phoneNumber ?? lead.phone_number ?? ""),
    leadSource: asString(lead.leadSource ?? lead.lead_source ?? lead.source ?? ""),
    assignedSalesperson: asString(
      lead.assignedSalesperson ??
        lead.assigned_salesperson ??
        lead.assignedTo ??
        "",
    ),
    status: toLeadStatus(lead.status),
    estimatedDealValue: asNumber(
      lead.estimatedDealValue ?? lead.estimated_deal_value ?? lead.dealValue ?? 0,
    ),
    createdDate: asIsoDate(lead.createdDate ?? lead.created_date ?? lead.createdAt),
    lastUpdatedDate: asIsoDate(
      lead.lastUpdatedDate ?? lead.last_updated_date ?? lead.updatedAt,
    ),
    notes,
  };
}

export function extractLeadsFromPayload(data: unknown): Lead[] {
  if (!data || typeof data !== "object") return [];
  const payload = data as { leads?: unknown };
  if (!Array.isArray(payload.leads)) return [];
  return payload.leads.map(coerceLead).filter(Boolean) as Lead[];
}

export async function fetchLeads(): Promise<Lead[] | null> {
  const data = await authedGet<unknown>("/leads").catch(() => null);
  if (!data || typeof data !== "object") return null;
  const payload = data as { leads?: unknown };
  if (!Array.isArray(payload.leads)) return null;
  return extractLeadsFromPayload(data);
}

export async function patchLead(
  leadId: string,
  patch: Record<string, unknown>,
): Promise<void> {
  await authedPatch<unknown>(`/leads/${leadId}`, patch);
}

export async function removeLead(leadId: string): Promise<void> {
  await authedDelete<unknown>(`/leads/${leadId}`);
}
