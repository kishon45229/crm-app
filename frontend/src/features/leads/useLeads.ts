"use client";

import * as React from "react";

import { loadLeads, saveLeads } from "./storage";
import type { Lead, LeadNote, LeadStatus } from "./types";
import { LEAD_STATUSES } from "./types";

import { getAccessToken } from "@/features/auth/token";

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

export type LeadSummary = {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  wonLeads: number;
  lostLeads: number;
  totalEstimatedDealValue: number;
  totalValueOfWonDeals: number;
};

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

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
  return {
    id,
    content: asString(note.content ?? note.note ?? ""),
    createdBy: asString(note.createdBy ?? note.created_by ?? ""),
    createdDate: asIsoDate(note.createdDate ?? note.created_date),
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
    leadName: asString(lead.leadName ?? lead.lead_name ?? ""),
    companyName: asString(lead.companyName ?? lead.company_name ?? ""),
    email: asString(lead.email ?? ""),
    phoneNumber: asString(lead.phoneNumber ?? lead.phone_number ?? ""),
    leadSource: asString(lead.leadSource ?? lead.lead_source ?? ""),
    assignedSalesperson: asString(
      lead.assignedSalesperson ?? lead.assigned_salesperson ?? "",
    ),
    status: toLeadStatus(lead.status),
    estimatedDealValue: asNumber(
      lead.estimatedDealValue ?? lead.estimated_deal_value ?? 0,
    ),
    createdDate: asIsoDate(lead.createdDate ?? lead.created_date),
    lastUpdatedDate: asIsoDate(lead.lastUpdatedDate ?? lead.last_updated_date),
    notes,
  };
}

function emptyDraft(): LeadDraft {
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

function toDraft(lead: Lead): LeadDraft {
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

export function useLeads(userId: string) {
  const [leads, setLeads] = React.useState<Lead[]>(() => loadLeads(userId));
  const [selectedLeadId, setSelectedLeadId] = React.useState<string>(() => {
    const initial = loadLeads(userId);
    return initial[0]?.id ?? "";
  });

  const selectedLeadIdRef = React.useRef<string>(selectedLeadId);
  React.useEffect(() => {
    selectedLeadIdRef.current = selectedLeadId;
  }, [selectedLeadId]);

  const [createDraft, setCreateDraft] = React.useState<LeadDraft>(() =>
    emptyDraft(),
  );
  const [editDraft, setEditDraft] = React.useState<LeadDraft>(() => {
    const initial = loadLeads(userId);
    const first = initial[0];
    return first ? toDraft(first) : emptyDraft();
  });

  const [noteDraft, setNoteDraft] = React.useState<string>("");

  React.useEffect(() => {
    saveLeads(userId, leads);
  }, [leads, userId]);

  const refreshFromServer = React.useCallback(async () => {
    const token = getAccessToken();
    if (!token) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
    const response = await fetch(`${baseUrl}/leads`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return;

    const data = (await response.json()) as unknown;
    if (!Array.isArray(data)) return;

    const serverLeads = data.map(coerceLead).filter(Boolean) as Lead[];

    const previousSelectedLeadId = selectedLeadIdRef.current;
    const nextSelectedLeadId =
      previousSelectedLeadId &&
      serverLeads.some((l) => l.id === previousSelectedLeadId)
        ? previousSelectedLeadId
        : (serverLeads[0]?.id ?? "");

    setLeads(serverLeads);
    setSelectedLeadId(nextSelectedLeadId);
    setNoteDraft("");

    const nextSelected =
      serverLeads.find((l) => l.id === nextSelectedLeadId) ??
      serverLeads[0] ??
      null;
    setEditDraft(nextSelected ? toDraft(nextSelected) : emptyDraft());
  }, []);

  const selectedLead = React.useMemo(() => {
    const direct = leads.find((lead) => lead.id === selectedLeadId);
    return direct ?? leads[0] ?? null;
  }, [leads, selectedLeadId]);

  const effectiveSelectedLeadId = selectedLead?.id ?? "";

  const selectLead = React.useCallback(
    (leadId: string) => {
      const lead = leads.find((l) => l.id === leadId) ?? null;
      setSelectedLeadId(lead?.id ?? "");
      setNoteDraft("");
      setEditDraft(lead ? toDraft(lead) : emptyDraft());
    },
    [leads],
  );

  const createLead = React.useCallback(() => {
    const createdDate = nowIso();
    const newLead: Lead = {
      id: generateId(),
      leadName: createDraft.leadName.trim(),
      companyName: createDraft.companyName.trim(),
      email: createDraft.email.trim(),
      phoneNumber: createDraft.phoneNumber.trim(),
      leadSource: createDraft.leadSource.trim(),
      assignedSalesperson: createDraft.assignedSalesperson.trim(),
      status: createDraft.status,
      estimatedDealValue: Number(createDraft.estimatedDealValue || 0),
      createdDate,
      lastUpdatedDate: createdDate,
      notes: [],
    };

    setLeads((prev) => [newLead, ...prev]);
    setSelectedLeadId(newLead.id);
    setEditDraft(toDraft(newLead));
    setCreateDraft(emptyDraft());
    setNoteDraft("");

    return newLead;
  }, [createDraft]);

  const updateLead = React.useCallback(
    (leadId: string, patch: Partial<Omit<Lead, "id" | "createdDate">>) => {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                ...patch,
                lastUpdatedDate: nowIso(),
              }
            : lead,
        ),
      );
    },
    [],
  );

  const saveEditDraft = React.useCallback(() => {
    if (!selectedLead) return;

    updateLead(selectedLead.id, {
      leadName: editDraft.leadName.trim(),
      companyName: editDraft.companyName.trim(),
      email: editDraft.email.trim(),
      phoneNumber: editDraft.phoneNumber.trim(),
      leadSource: editDraft.leadSource.trim(),
      assignedSalesperson: editDraft.assignedSalesperson.trim(),
      status: editDraft.status,
      estimatedDealValue: Number(editDraft.estimatedDealValue || 0),
    });
  }, [editDraft, selectedLead, updateLead]);

  const deleteLead = React.useCallback(
    (leadId: string) => {
      setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
      if (selectedLeadId === leadId) {
        setSelectedLeadId("");
        setNoteDraft("");
        setEditDraft(emptyDraft());
      }
    },
    [selectedLeadId],
  );

  const addNote = React.useCallback(
    (leadId: string, createdBy: string, content: string) => {
      const note: LeadNote = {
        id: generateId(),
        content,
        createdBy,
        createdDate: nowIso(),
      };

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId
            ? {
                ...lead,
                notes: [note, ...lead.notes],
                lastUpdatedDate: nowIso(),
              }
            : lead,
        ),
      );

      setNoteDraft("");
      return note;
    },
    [],
  );

  const summary: LeadSummary = React.useMemo(() => {
    const totalLeads = leads.length;
    const newLeads = leads.filter((l) => l.status === "New").length;
    const qualifiedLeads = leads.filter((l) => l.status === "Qualified").length;
    const wonLeads = leads.filter((l) => l.status === "Won").length;
    const lostLeads = leads.filter((l) => l.status === "Lost").length;
    const totalEstimatedDealValue = leads.reduce(
      (sum, l) =>
        sum +
        (Number.isFinite(l.estimatedDealValue) ? l.estimatedDealValue : 0),
      0,
    );
    const totalValueOfWonDeals = leads
      .filter((l) => l.status === "Won")
      .reduce(
        (sum, l) =>
          sum +
          (Number.isFinite(l.estimatedDealValue) ? l.estimatedDealValue : 0),
        0,
      );

    return {
      totalLeads,
      newLeads,
      qualifiedLeads,
      wonLeads,
      lostLeads,
      totalEstimatedDealValue,
      totalValueOfWonDeals,
    };
  }, [leads]);

  return {
    leads,
    selectedLead,
    selectedLeadId: effectiveSelectedLeadId,
    selectLead,

    createDraft,
    setCreateDraft,
    createLead,

    editDraft,
    setEditDraft,
    saveEditDraft,

    noteDraft,
    setNoteDraft,
    addNote,

    updateLead,
    deleteLead,

    summary,

    refreshFromServer,
  };
}
