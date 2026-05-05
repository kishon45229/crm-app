import type { Metadata } from "next";

import { LoginFormContainer } from "@/features/auth/components/LoginFormContainer";

export const metadata: Metadata = {
    title: "Login",
};

export default function LoginPage() {
    return (
        <main className="flex flex-1 items-center justify-center px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-8 text-foreground">
                <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
                <p className="mt-2 text-sm text-foreground/70">
                    Use your email and password to continue.
                </p>

                <div className="mt-8">
                    <LoginFormContainer />
                </div>
            </div>
        </main>
    );
}
