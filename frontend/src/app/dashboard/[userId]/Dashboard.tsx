"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { refreshAccessToken } from "@/features/auth/api";
import {
    clearAccessToken,
    getAccessToken,
    getAccessTokenUserId,
    isAccessTokenExpired,
} from "@/features/auth/token";

export type DashboardProps = {
    userId: string;
};

export default function Dashboard({ userId }: DashboardProps) {
    const router = useRouter();
    const [isReady, setIsReady] = React.useState(false);

    React.useEffect(() => {
        let cancelled = false;

        async function ensureAuthenticated() {
            const token = getAccessToken();

            if (!token) {
                router.replace("/login");
                return;
            }

            if (isAccessTokenExpired(token)) {
                try {
                    await refreshAccessToken();
                } catch {
                    clearAccessToken();
                    router.replace("/login");
                    return;
                }
            }

            const currentToken = getAccessToken();
            if (!currentToken) {
                router.replace("/login");
                return;
            }

            const tokenUserId = getAccessTokenUserId(currentToken);
            if (!tokenUserId || tokenUserId !== userId) {
                router.replace("/login");
                return;
            }

            if (!cancelled) setIsReady(true);
        }

        void ensureAuthenticated();

        return () => {
            cancelled = true;
        };
    }, [router, userId]);

    if (!isReady) {
        return (
            <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-emerald-50 to-zinc-100 px-6 py-12 sm:py-16 dark:from-emerald-950 dark:to-zinc-900">
                <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-6 text-foreground shadow-lg sm:p-8">
                    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                    <p className="mt-2 text-sm text-foreground/70">Checking your session…</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-emerald-50 to-zinc-100 px-6 py-12 sm:py-16 dark:from-emerald-950 dark:to-zinc-900">
            <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-6 text-foreground shadow-lg sm:p-8">
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="mt-2 text-sm text-foreground/70">User: {userId}</p>
            </div>
        </main>
    );
}
