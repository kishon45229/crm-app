import { Box } from "@mui/material";

import { LeadSummaryCards } from "./LeadSummaryCards";
import { useLeadPanelsContext } from "./lead-panels-context";

export function LeadPanelsHomeSection() {
    const {
        leadState: { summary },
    } = useLeadPanelsContext();

    return (
        <Box
            sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(4, 1fr)",
                },
                mt: 3,
            }}
        >
            <LeadSummaryCards summary={summary} />
        </Box>
    );
}
