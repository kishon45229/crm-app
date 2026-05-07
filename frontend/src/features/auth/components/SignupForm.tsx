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

import type { SignupValues } from "../types";

export type SignupFormProps = {
    onSubmit?: (values: SignupValues) => void | Promise<void>;
    onSuccess?: () => void | Promise<void>;
};

type ToastState = {
    open: boolean;
    severity: "success" | "error";
    message: string;
};

export function SignupForm({ onSubmit, onSuccess }: SignupFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignupValues>({
        defaultValues: {
            username: "",
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
        async (values: SignupValues) => {
            if (!onSubmit) return;
            try {
                await onSubmit({
                    username: values.username.trim(),
                    email: values.email.trim(),
                    password: values.password,
                });

                setToast({
                    open: true,
                    severity: "success",
                    message: "Signup successful.",
                });

                await new Promise((resolve) => window.setTimeout(resolve, 900));
                if (onSuccess) {
                    await onSuccess();
                }
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Sign-up failed. Please try again.";
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
                    name="username"
                    control={control}
                    rules={{
                        required: "Username is required.",
                        minLength: {
                            value: 2,
                            message: "Username must be at least 2 characters.",
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="username"
                            label="Username"
                            autoComplete="username"
                            autoFocus
                            fullWidth
                            color="success"
                            sx={textFieldSx}
                            error={Boolean(errors.username?.message)}
                            helperText={errors.username?.message}
                        />
                    )}
                />

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
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters.",
                        },
                    }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="password"
                            label="Password"
                            type="password"
                            autoComplete="new-password"
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
                            <span>Creating account…</span>
                            <CircularProgress size={18} color="inherit" />
                        </Box>
                    ) : (
                        "Create account"
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
