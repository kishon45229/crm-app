import * as React from "react";
import {
    Box,
    Button,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { DashboardSectionKey, SidebarItem } from "./LeadSidebar";
import { sidebarItems } from "./LeadSidebar";
import { LeadSummaryCards } from "./LeadSummaryCards";

import type { LeadStatus } from "@/features/leads/types";
import { LEAD_STATUSES } from "@/features/leads/types";
import type { useLeads } from "@/features/leads/useLeads";
import { createLeadSchema, type CreateLeadInput } from "@/features/leads/schema";

export type LeadPanelsProps = {
    activeSection: DashboardSectionKey;
    setActiveSection: (key: DashboardSectionKey) => void;
    leadState: ReturnType<typeof useLeads>;
    createdByUserId: string;
};

function getSection(key: DashboardSectionKey): SidebarItem {
    return sidebarItems.find((s) => s.key === key) ?? sidebarItems[0]!;
}

export function LeadPanels({
    activeSection,
    setActiveSection,
    leadState,
    createdByUserId,
}: LeadPanelsProps) {
    const section = getSection(activeSection);

    const {
        leads,
        summary,
        selectedLead,
        selectedLeadId,
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
    } = leadState;

    const createForm = useForm<CreateLeadInput>({
        resolver: zodResolver(createLeadSchema),
        mode: 'onChange',
        defaultValues: {
            leadName: "",
            companyName: "",
            email: "",
            phoneNumber: "",
            leadSource: "",
            assignedSalesperson: "",
            status: "New",
            estimatedDealValue: "",
        },
    });

    const { register, handleSubmit, control, formState: { errors, isValid }, reset } = createForm;

    const onCreateSubmit = (data: CreateLeadInput) => {
        setCreateDraft(data);
        const created = createLead();
        selectLead(created.id);
        setActiveSection("view");
        reset();
    };

    return (
        <>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: -0.25 }}>
                {section.label}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: "text.secondary" }}>
                {section.helper}
            </Typography>

            {activeSection === "home" ? (
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
            ) : null}

            {activeSection === "create" ? (
                <Paper variant="outlined" sx={{ mt: 3, borderRadius: 2, p: 3 }}>
                    <Stack spacing={2}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            Lead information
                        </Typography>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                {...register("leadName")}
                                label="Lead Name"
                                fullWidth
                                required
                                error={!!errors.leadName}
                                helperText={errors.leadName?.message}
                            />
                            <TextField
                                {...register("companyName")}
                                label="Company Name"
                                fullWidth
                                error={!!errors.companyName}
                                helperText={errors.companyName?.message}
                            />
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                {...register("email")}
                                label="Email"
                                type="email"
                                fullWidth
                                required
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                            <TextField
                                {...register("phoneNumber")}
                                label="Phone Number"
                                fullWidth
                                error={!!errors.phoneNumber}
                                helperText={errors.phoneNumber?.message}
                            />
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <TextField
                                {...register("leadSource")}
                                label="Lead Source"
                                fullWidth
                                error={!!errors.leadSource}
                                helperText={errors.leadSource?.message}
                            />
                            <TextField
                                {...register("assignedSalesperson")}
                                label="Assigned Salesperson"
                                fullWidth
                                error={!!errors.assignedSalesperson}
                                helperText={errors.assignedSalesperson?.message}
                            />
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.status}>
                                        <InputLabel id="create-status-label">Status</InputLabel>
                                        <Select
                                            {...field}
                                            labelId="create-status-label"
                                            label="Status"
                                        >
                                            {LEAD_STATUSES.map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.status && (
                                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                                {errors.status.message}
                                            </Typography>
                                        )}
                                    </FormControl>
                                )}
                            />

                            <TextField
                                {...register("estimatedDealValue")}
                                label="Estimated Deal Value"
                                type="number"
                                slotProps={{
                                    htmlInput: {
                                        min: 0,
                                        step: 1,
                                    },
                                }}
                                fullWidth
                                error={!!errors.estimatedDealValue}
                                helperText={errors.estimatedDealValue?.message}
                            />
                        </Stack>

                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
                            <Button
                                variant="outlined"
                                onClick={() => reset()}
                            >
                                Reset
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit(onCreateSubmit)}
                                disabled={!isValid}
                            >
                                Create lead
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            ) : null}

            {activeSection === "view" ? (
                <Paper variant="outlined" sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
                    {leads.length === 0 ? (
                        <Box sx={{ p: 3 }}>
                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                No leads yet. Use “Create leads” to add your first lead.
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer sx={{ maxWidth: "100%", overflowX: "auto" }}>
                            <Table size="small" sx={{ minWidth: 760 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Lead</TableCell>
                                        <TableCell>Company</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell align="right">Value</TableCell>
                                        <TableCell>Assigned</TableCell>
                                        <TableCell>Updated</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {leads.map((lead) => (
                                        <TableRow key={lead.id} hover>
                                            <TableCell sx={{ fontWeight: 700 }}>{lead.leadName}</TableCell>
                                            <TableCell>{lead.companyName || "—"}</TableCell>
                                            <TableCell>{lead.email || "—"}</TableCell>
                                            <TableCell>{lead.status}</TableCell>
                                            <TableCell align="right">
                                                {lead.estimatedDealValue
                                                    ? lead.estimatedDealValue.toLocaleString()
                                                    : "—"}
                                            </TableCell>
                                            <TableCell>{lead.assignedSalesperson || "—"}</TableCell>
                                            <TableCell>
                                                {new Date(lead.lastUpdatedDate).toLocaleString()}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    variant="outlined"
                                                    onClick={() => deleteLead(lead.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            ) : null}
        </>
    );
}
