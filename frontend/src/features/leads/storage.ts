import type { Lead } from "./types";

function canUseLocalStorage(): boolean {
  return (
    typeof window !== "undefined" && typeof window.sessionStorage !== "undefined"
  );
}

function getLeadsStorageKey(userId: string): string {
  return `crm_leads_${userId}`;
}

export function loadLeads(userId: string): Lead[] {
  if (!canUseLocalStorage()) return [];

  const raw = window.sessionStorage.getItem(getLeadsStorageKey(userId));
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as Lead[]) : [];
  } catch {
    return [];
  }
}

export function saveLeads(userId: string, leads: Lead[]): void {
  if (!canUseLocalStorage()) return;
  window.sessionStorage.setItem(
    getLeadsStorageKey(userId),
    JSON.stringify(leads),
  );
}
