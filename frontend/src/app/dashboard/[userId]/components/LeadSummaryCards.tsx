import * as React from "react";
import { Card, CardContent, Typography } from "@mui/material";

import type { LeadSummary } from "@/features/leads/useLeads";

export type LeadSummaryCardsProps = {
    summary: LeadSummary;
};

function MetricCard({ label, value }: { label: string; value: string }) {
    return (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent sx={{ py: 2 }}>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {label}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
}

export const LeadSummaryCards = React.memo(function LeadSummaryCards({
    summary,
}: LeadSummaryCardsProps) {
    return (
        <>
            <MetricCard label="Total Leads" value={summary.totalLeads.toLocaleString()} />
            <MetricCard label="New Leads" value={summary.newLeads.toLocaleString()} />
            <MetricCard
                label="Qualified Leads"
                value={summary.qualifiedLeads.toLocaleString()}
            />
            <MetricCard label="Won Leads" value={summary.wonLeads.toLocaleString()} />
            <MetricCard label="Lost Leads" value={summary.lostLeads.toLocaleString()} />
            <MetricCard
                label="Total Estimated Deal Value"
                value={summary.totalEstimatedDealValue.toLocaleString()}
            />
            <MetricCard
                label="Total Value of Won Deals"
                value={summary.totalValueOfWonDeals.toLocaleString()}
            />
        </>
    );
});
