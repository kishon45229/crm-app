"use client";

import * as React from "react";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Snackbar,
    Stack,
    TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import type { LoginValues } from "../types";

export type LoginFormProps = {
    onSubmit?: (values: LoginValues) => void | Promise<void>;
    onSuccess?: () => void | Promise<void>;
};

type ToastState = {
    open: boolean;
    severity: "success" | "error";
    message: string;
};

export function LoginForm({ onSubmit, onSuccess }: LoginFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [toast, setToast] = React.useState<ToastState>({
        open: false,
        severity: "success",
        message: "",
    });

    const onValidSubmit = React.useCallback(
        async (values: LoginValues) => {
            if (!onSubmit) return;
            try {
                await onSubmit({
                    email: values.email.trim(),
                    password: values.password,
                });

                setToast({
                    open: true,
                    severity: "success",
                    message: "Login successful.",
                });

                await new Promise((resolve) => window.setTimeout(resolve, 900));
                if (onSuccess) {
                    await onSuccess();
                }
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Sign-in failed. Please try again.";
                setToast({
                    open: true,
                    severity: "error",
                    message,
                });
            }
        },
        [onSubmit, onSuccess]
    );

    const handleToastClose = React.useCallback(() => {
        setToast((prev) => ({ ...prev, open: false }));
    }, []);

    const textFieldSx = React.useCallback(
        (theme: import("@mui/material/styles").Theme) => ({
            "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: theme.palette.divider,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
                borderWidth: 1,
                borderColor: theme.palette.text.primary,
            },
        }),
        []
    );

    return (
        <Box component="form" noValidate onSubmit={handleSubmit(onValidSubmit)}>
            <Stack spacing={2}>
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: "Email is required.",
                        pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Enter a valid email address.",
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="email"
                            label="Email"
                            type="email"
                            autoComplete="email"
                            inputMode="email"
                            autoFocus
                            fullWidth
                            color="success"
                            sx={textFieldSx}
                            error={Boolean(errors.email?.message)}
                            helperText={errors.email?.message}
                        />
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    rules={{
                        required: "Password is required.",
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="password"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            fullWidth
                            color="success"
                            sx={textFieldSx}
                            error={Boolean(errors.password?.message)}
                            helperText={errors.password?.message}
                        />
                    )}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                >
                    {isSubmitting ? (
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                            <span>Signing in…</span>
                            <CircularProgress size={18} color="inherit" />
                        </Box>
                    ) : (
                        "Sign in"
                    )}
                </Button>
            </Stack>

            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={handleToastClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleToastClose} severity={toast.severity} variant="filled">
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
