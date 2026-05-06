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
