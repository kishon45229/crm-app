import * as React from "react";
import {
    Box,
    Drawer,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { useLeadPanelsContext } from "./lead-panels-context";

export function LeadPanelsViewSection() {
    const [isNotesDrawerOpen, setIsNotesDrawerOpen] = React.useState(false);
    const [selectedLeadId, setSelectedLeadId] = React.useState<string | null>(null);

    const {
        leadState: { leads },
        openEditModal,
        handleDeleteLead,
        isDeletingLeadId,
    } = useLeadPanelsContext();

    const selectedLead = React.useMemo(() => leads.find((lead) => lead.id === selectedLeadId) ?? null, [leads, selectedLeadId]);

    const openNotesDrawer = (leadId: string) => {
        setSelectedLeadId(leadId);
        setIsNotesDrawerOpen(true);
    };

    return (
        <>
            <Paper variant="outlined" sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
                {leads.length === 0 ? (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            No leads yet. Use "Create leads" to add your first lead.
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
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {leads.map((lead) => (
                                    <TableRow key={lead.id} hover>
                                        <TableCell sx={{ fontWeight: 700 }}>{lead.leadName}</TableCell>
                                        <TableCell>{lead.companyName || "-"}</TableCell>
                                        <TableCell>{lead.email || "-"}</TableCell>
                                        <TableCell>{lead.status}</TableCell>
                                        <TableCell align="right">
                                            {lead.estimatedDealValue ? lead.estimatedDealValue.toLocaleString() : "-"}
                                        </TableCell>
                                        <TableCell>{lead.assignedSalesperson || "-"}</TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => openNotesDrawer(lead.id)}
                                                    aria-label="View notes"
                                                >
                                                    <CommentOutlinedIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => openEditModal(lead.id)}
                                                    aria-label="Edit lead"
                                                >
                                                    <EditOutlinedIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => void handleDeleteLead(lead.id)}
                                                    disabled={isDeletingLeadId === lead.id}
                                                    aria-label="Delete lead"
                                                >
                                                    <DeleteOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <Drawer anchor="right" open={isNotesDrawerOpen} onClose={() => setIsNotesDrawerOpen(false)}>
                <Box sx={{ width: { xs: 320, sm: 400 }, p: 2 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                Notes
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {selectedLead?.leadName || "-"}
                            </Typography>
                        </Box>
                        <IconButton size="small" onClick={() => setIsNotesDrawerOpen(false)} aria-label="Close notes panel">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Stack>

                    {selectedLead?.notes.length ? (
                        <Stack spacing={1.5}>
                            {selectedLead.notes.map((note) => (
                                <Paper key={note.id} variant="outlined" sx={{ p: 1.5 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                        {note.createdBy || "Unknown author"}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            mt: 0.5,
                                            color: "text.secondary",
                                            whiteSpace: "pre-wrap",
                                            wordBreak: "break-word",
                                        }}
                                    >
                                        {note.content || "-"}
                                    </Typography>
                                </Paper>
                            ))}
                        </Stack>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No notes yet.
                        </Typography>
                    )}
                </Box>
            </Drawer>
        </>
    );
}
