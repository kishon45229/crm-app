"use client";

import * as React from "react";
import { Alert, Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import type { LoginValues } from "../types";

export type LoginFormProps = {
    onSubmit?: (values: LoginValues) => void | Promise<void>;
};

export function LoginForm({ onSubmit }: LoginFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginValues>({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onValidSubmit = React.useCallback(
        async (values: LoginValues) => {
            if (!onSubmit) return;
            try {
                await onSubmit({
                    email: values.email.trim(),
                    password: values.password,
                });
            } catch (error) {
                const message =
                    error instanceof Error
                        ? error.message
                        : "Sign-in failed. Please try again.";
                setError("root", { message });
            }
        },
        [onSubmit, setError]
    );

    const formErrorMessage = errors.root?.message;

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
                            error={Boolean(errors.password?.message)}
                            helperText={errors.password?.message}
                        />
                    )}
                />

                {formErrorMessage ? <Alert severity="error">{formErrorMessage}</Alert> : null}

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
        </Box>
    );
}
