"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import type { LoginValues } from "../types";
import { authedGet, login } from "../api";
import { LoginForm } from "./LoginForm";
import { extractLeadsFromPayload } from "@/features/leads/api";
import { saveLeads } from "@/features/leads/storage";

export function LoginFormContainer() {
    const router = useRouter();
    const redirectPathRef = React.useRef<string | null>(null);

    const handleSubmit = React.useCallback(
        async (values: LoginValues) => {
            const response = await login(values);
            // if (response.user) 

            const leadsPayload = await authedGet<unknown>("/leads").catch(() => null);
            const leads = extractLeadsFromPayload(leadsPayload);
            saveLeads(response.user.id, leads);
            redirectPathRef.current = `/dashboard/${response.user.id}`;
        },
        []
    );

    const handleSuccess = React.useCallback(() => {
        if (!redirectPathRef.current) return;
        router.push(redirectPathRef.current);
    }, [router]);

    return <LoginForm onSubmit={handleSubmit} onSuccess={handleSuccess} />;
}
