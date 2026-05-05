"use client";

import * as React from "react";
import { Alert, Box, Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

import type { SignupValues } from "../types";

export type SignupFormProps = {
    onSubmit?: (values: SignupValues) => void | Promise<void>;
};

export function SignupForm({ onSubmit }: SignupFormProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<SignupValues>({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
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
            } catch {
                setError("root", { message: "Sign-up failed. Please try again." });
            }
        },
        [onSubmit, setError]
    );

    const formErrorMessage = errors.root?.message;

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
                            fullWidth
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
                            error={Boolean(errors.password?.message)}
                            helperText={errors.password?.message}
                        />
                    )}
                />

                {formErrorMessage ? <Alert severity="error">{formErrorMessage}</Alert> : null}

                <Button
                    type="submit"
                    variant="contained"
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
        </Box>
    );
}
