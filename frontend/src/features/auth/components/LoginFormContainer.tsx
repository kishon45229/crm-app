"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { LoginValues } from "../types";
import { login } from "../api";
import { LoginForm } from "./LoginForm";

export function LoginFormContainer() {
    const router = useRouter();

    const handleSubmit = React.useCallback(
        async (values: LoginValues) => {
            await login(values);
            router.push("/");
        },
        [router]
    );

    return <LoginForm onSubmit={handleSubmit} />;
}
