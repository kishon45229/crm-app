import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from "@mui/material";

import type { LeadStatus } from "@/features/leads/types";
import { LEAD_STATUSES } from "@/features/leads/types";
import { useLeadPanelsContext } from "./lead-panels-context";

export function LeadPanelsEditDialog() {
    const { isEditOpen, setIsEditOpen, editForm, setEditForm, isSavingEdit, handleSaveEdit } = useLeadPanelsContext();

    return (
        <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Lead Name"
                        value={editForm.leadName}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, leadName: event.target.value }))}
                        fullWidth
                    />
                    <TextField
                        label="Company Name"
                        value={editForm.companyName}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, companyName: event.target.value }))}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        value={editForm.email}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
                        fullWidth
                    />
                    <TextField
                        label="Phone Number"
                        value={editForm.phoneNumber}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
                        fullWidth
                    />
                    <TextField
                        label="Lead Source"
                        value={editForm.leadSource}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, leadSource: event.target.value }))}
                        fullWidth
                    />
                    <TextField
                        label="Assigned Salesperson"
                        value={editForm.assignedSalesperson}
                        onChange={(event) =>
                            setEditForm((prev) => ({ ...prev, assignedSalesperson: event.target.value }))
                        }
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel id="edit-status-label">Status</InputLabel>
                        <Select
                            labelId="edit-status-label"
                            value={editForm.status}
                            label="Status"
                            onChange={(event) =>
                                setEditForm((prev) => ({ ...prev, status: event.target.value as LeadStatus }))
                            }
                        >
                            {LEAD_STATUSES.map((status) => (
                                <MenuItem key={status} value={status}>
                                    {status}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Estimated Deal Value"
                        type="number"
                        value={editForm.estimatedDealValue}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, estimatedDealValue: event.target.value }))}
                        fullWidth
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button variant="contained" onClick={() => void handleSaveEdit()} disabled={isSavingEdit}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
