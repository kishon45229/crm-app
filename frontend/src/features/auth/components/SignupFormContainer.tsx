"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { SignupValues } from "../types";
import { signup } from "../api";
import { SignupForm } from "./SignupForm";

export function SignupFormContainer() {
    const router = useRouter();

    const handleSubmit = React.useCallback(
        async (values: SignupValues) => {
            await signup(values);
        },
        []
    );

    const handleSuccess = React.useCallback(() => {
        router.push("/login");
    }, [router]);

    return <SignupForm onSubmit={handleSubmit} onSuccess={handleSuccess} />;
}
