export type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal Sent"
  | "Won"
  | "Lost";

export type LeadNote = {
  id: string;
  content: string;
  createdBy: string;
  createdDate: string;
};

export type Lead = {
  id: string;
  leadName: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  leadSource: string;
  assignedSalesperson: string;
  status: LeadStatus;
  estimatedDealValue: number;
  createdDate: string;
  lastUpdatedDate: string;
  notes: LeadNote[];
};

export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Won",
  "Lost",
];

export type LeadSource =
  | "Website"
  | "LinkedIn"
  | "Referral"
  | "ColdEmail"
  | "Event"
  | "Other";

export const LEAD_SOURCES: LeadSource[] = [
  "Website",
  "LinkedIn",
  "Referral",
  "ColdEmail",
  "Event",
  "Other",
];

export type SalesPerson = "Alice" | "Bob" | "Charlie" | "Unassigned";

export const SALES_PEOPLE: SalesPerson[] = [
  "Alice",
  "Bob",
  "Charlie",
  "Unassigned",
];
