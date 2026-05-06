import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { createLeadSchema, type CreateLeadInput } from "@/features/leads/schema";
import type { LeadStatus } from "@/features/leads/types";
import type { useLeads } from "@/features/leads/useLeads";
import type { DashboardSectionKey, SidebarItem } from "./LeadSidebar";
import { sidebarItems } from "./LeadSidebar";

type UseLeadPanelsStateArgs = {
    activeSection: DashboardSectionKey;
    setActiveSection: (key: DashboardSectionKey) => void;
    leadState: ReturnType<typeof useLeads>;
};

function getSection(key: DashboardSectionKey): SidebarItem {
    return sidebarItems.find((s) => s.key === key) ?? sidebarItems[0]!;
}

export function useLeadPanelsState({
    activeSection,
    setActiveSection,
    leadState,
}: UseLeadPanelsStateArgs) {
    const { leads, createLead, setCreateDraft, selectLead, saveLeadEdit, deleteLead, addNote } = leadState;

    const section = React.useMemo(() => getSection(activeSection), [activeSection]);

    const createForm = useForm<CreateLeadInput>({
        resolver: zodResolver(createLeadSchema),
        mode: "onChange",
        defaultValues: {
            leadName: "",
            companyName: "",
            email: "",
            phoneNumber: "",
            leadSource: "",
            assignedSalesperson: "",
            status: "New",
            estimatedDealValue: "",
            note: "",
            createdBy: "",
        },
    });

    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [editingLeadId, setEditingLeadId] = React.useState<string>("");
    const [editForm, setEditForm] = React.useState({
        leadName: "",
        companyName: "",
        email: "",
        phoneNumber: "",
        leadSource: "",
        assignedSalesperson: "",
        status: "New" as LeadStatus,
        estimatedDealValue: "",
    });
    const [isSavingEdit, setIsSavingEdit] = React.useState(false);
    const [isDeletingLeadId, setIsDeletingLeadId] = React.useState<string>("");

    const onCreateSubmit = React.useCallback(
        (data: CreateLeadInput) => {
            setCreateDraft(data);
            const created = createLead();
            const note = data.note?.trim();
            const createdBy = data.createdBy?.trim();
            if (note) {
                addNote(created.id, createdBy || "Unknown author", note);
            }
            selectLead(created.id);
            setActiveSection("view");
            createForm.reset();
        },
        [addNote, createForm, createLead, selectLead, setActiveSection, setCreateDraft],
    );

    const openEditModal = React.useCallback(
        (leadId: string) => {
            const lead = leads.find((item) => item.id === leadId);
            if (!lead) return;
            setEditingLeadId(lead.id);
            setEditForm({
                leadName: lead.leadName,
                companyName: lead.companyName,
                email: lead.email,
                phoneNumber: lead.phoneNumber,
                leadSource: lead.leadSource,
                assignedSalesperson: lead.assignedSalesperson,
                status: lead.status,
                estimatedDealValue: lead.estimatedDealValue === 0 ? "" : String(lead.estimatedDealValue),
            });
            setIsEditOpen(true);
        },
        [leads],
    );

    const handleSaveEdit = React.useCallback(async () => {
        if (!editingLeadId) return;
        try {
            setIsSavingEdit(true);
            await saveLeadEdit(editingLeadId, editForm);
            setIsEditOpen(false);
        } finally {
            setIsSavingEdit(false);
        }
    }, [editForm, editingLeadId, saveLeadEdit]);

    const handleDeleteLead = React.useCallback(
        async (leadId: string) => {
            const ok = window.confirm("Are you sure you want to delete this lead?");
            if (!ok) return;
            try {
                setIsDeletingLeadId(leadId);
                await deleteLead(leadId);
            } finally {
                setIsDeletingLeadId("");
            }
        },
        [deleteLead],
    );

    return {
        section,
        createForm,
        onCreateSubmit,
        isEditOpen,
        setIsEditOpen,
        editForm,
        setEditForm,
        isSavingEdit,
        isDeletingLeadId,
        openEditModal,
        handleSaveEdit,
        handleDeleteLead,
    };
}
