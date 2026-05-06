import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

import { LEAD_STATUSES } from "@/features/leads/types";
import { useLeadPanelsContext } from "./lead-panels-context";

export function LeadPanelsCreateSection() {
    const { createForm, onCreateSubmit } = useLeadPanelsContext();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid },
        reset,
    } = createForm;

    return (
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
                                <Select {...field} labelId="create-status-label" label="Status">
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
                    <Button variant="outlined" onClick={() => reset()}>
                        Reset
                    </Button>
                    <Button variant="contained" onClick={handleSubmit(onCreateSubmit)} disabled={!isValid}>
                        Create lead
                    </Button>
                </Box>
            </Stack>
        </Paper>
    );
}
