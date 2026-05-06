import { Typography } from "@mui/material";

import type { DashboardSectionKey } from "./LeadSidebar";
import { LeadPanelsCreateSection } from "./LeadPanelsCreateSection";
import { LeadPanelsEditDialog } from "./LeadPanelsEditDialog";
import { LeadPanelsHomeSection } from "./LeadPanelsHomeSection";
import { LeadPanelsViewSection } from "./LeadPanelsViewSection";
import { LeadPanelsProvider } from "./lead-panels-context";
import { useLeadPanelsState } from "./useLeadPanelsState";

import type { useLeads } from "@/features/leads/useLeads";

export type LeadPanelsProps = {
    activeSection: DashboardSectionKey;
    setActiveSection: (key: DashboardSectionKey) => void;
    leadState: ReturnType<typeof useLeads>;
    createdByUserId: string;
};

export function LeadPanels({ activeSection, setActiveSection, leadState, createdByUserId }: LeadPanelsProps) {
    const panelState = useLeadPanelsState({
        activeSection,
        setActiveSection,
        leadState,
    });

    return (
        <LeadPanelsProvider
            value={{
                activeSection,
                setActiveSection,
                createdByUserId,
                leadState,
                ...panelState,
            }}
        >
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.25 }}>
                {panelState.section.label}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
                {panelState.section.helper}
            </Typography>

            {activeSection === "home" ? <LeadPanelsHomeSection /> : null}
            {activeSection === "create" ? <LeadPanelsCreateSection /> : null}
            {activeSection === "view" ? <LeadPanelsViewSection /> : null}

            <LeadPanelsEditDialog />
        </LeadPanelsProvider>
    );
}
