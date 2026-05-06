import { Box, IconButton, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import { useLeadPanelsContext } from "./lead-panels-context";

export function LeadPanelsViewSection() {
    const {
        leadState: { leads },
        openEditModal,
        handleDeleteLead,
        isDeletingLeadId,
    } = useLeadPanelsContext();

    return (
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
                                <TableCell>Notes</TableCell>
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
                                    <TableCell sx={{ minWidth: 260, maxWidth: 360 }}>
                                        {lead.notes.length === 0 ? (
                                            <Typography variant="body2" color="text.secondary">
                                                No notes yet
                                            </Typography>
                                        ) : (
                                            <Stack spacing={0.75}>
                                                {lead.notes.map((note) => (
                                                    <Box key={note.id}>
                                                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                                                            {note.createdBy || "Unknown author"}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: "text.secondary",
                                                                whiteSpace: "pre-wrap",
                                                                wordBreak: "break-word",
                                                            }}
                                                        >
                                                            {note.content || "-"}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Stack>
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
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
    );
}
