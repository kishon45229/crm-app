"use client";

import * as React from "react";

import { fetchLeads, patchLead, removeLead } from "./api";
import {
  draftToPatch,
  emptyDraft,
  generateId,
  nowIso,
  toDraft,
  type LeadDraft,
} from "./helpers";
import { loadLeads, saveLeads } from "./storage";
import type { Lead, LeadNote } from "./types";
import { getUser } from "../auth/user";

export type LeadSummary = {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  wonLeads: number;
  lostLeads: number;
  totalEstimatedDealValue: number;
  totalValueOfWonDeals: number;
};

export function useLeads() {
  const user = getUser();
  const userId = user?.id ?? "unknown_user";

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
    const serverLeads = await fetchLeads();
    if (!serverLeads) return;

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

  const saveEditDraft = React.useCallback(async () => {
    if (!selectedLead) return false;

    const patch = draftToPatch(editDraft);
    await patchLead(selectedLead.id, patch as Record<string, unknown>);
    updateLead(selectedLead.id, patch);
    return true;
  }, [editDraft, selectedLead, updateLead]);

  const saveLeadEdit = React.useCallback(
    async (leadId: string, draft: LeadDraft) => {
      const patch = draftToPatch(draft);
      await patchLead(leadId, patch as Record<string, unknown>);
      updateLead(leadId, patch);
      if (selectedLeadIdRef.current === leadId) {
        setEditDraft(draft);
      }
      return true;
    },
    [updateLead],
  );

  const deleteLead = React.useCallback(
    async (leadId: string) => {
      await removeLead(leadId);
      setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
      if (selectedLeadId === leadId) {
        setSelectedLeadId("");
        setNoteDraft("");
        setEditDraft(emptyDraft());
      }
      return true;
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
    saveLeadEdit,

    noteDraft,
    setNoteDraft,
    addNote,

    updateLead,
    deleteLead,

    summary,

    refreshFromServer,
  };
}
