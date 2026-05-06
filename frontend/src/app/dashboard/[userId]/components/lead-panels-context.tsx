import * as React from "react";
import type { UseFormReturn } from "react-hook-form";

import type { DashboardSectionKey, SidebarItem } from "./LeadSidebar";
import type { CreateLeadInput } from "@/features/leads/schema";
import type { LeadStatus } from "@/features/leads/types";
import type { useLeads } from "@/features/leads/useLeads";

export type LeadPanelsContextValue = {
    activeSection: DashboardSectionKey;
    setActiveSection: (key: DashboardSectionKey) => void;
    createdByUserId: string;
    createdByUserName: string;
    section: SidebarItem;
    leadState: ReturnType<typeof useLeads>;
    createForm: UseFormReturn<CreateLeadInput>;
    onCreateSubmit: (data: CreateLeadInput) => void;
    isEditOpen: boolean;
    setIsEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
    editForm: {
        leadName: string;
        companyName: string;
        email: string;
        phoneNumber: string;
        leadSource: string;
        assignedSalesperson: string;
        status: LeadStatus;
        estimatedDealValue: string;
    };
    setEditForm: React.Dispatch<
        React.SetStateAction<{
            leadName: string;
            companyName: string;
            email: string;
            phoneNumber: string;
            leadSource: string;
            assignedSalesperson: string;
            status: LeadStatus;
            estimatedDealValue: string;
        }>
    >;
    isSavingEdit: boolean;
    isDeletingLeadId: string;
    openEditModal: (leadId: string) => void;
    handleSaveEdit: () => Promise<void>;
    handleDeleteLead: (leadId: string) => Promise<void>;
};

const LeadPanelsContext = React.createContext<LeadPanelsContextValue | null>(null);

export function LeadPanelsProvider({
    value,
    children,
}: {
    value: LeadPanelsContextValue;
    children: React.ReactNode;
}) {
    return <LeadPanelsContext.Provider value={value}>{children}</LeadPanelsContext.Provider>;
}

export function useLeadPanelsContext() {
    const ctx = React.useContext(LeadPanelsContext);
    if (!ctx) {
        throw new Error("useLeadPanelsContext must be used within LeadPanelsProvider");
    }
    return ctx;
}
