import type { Metadata } from "next";

import { SignupFormContainer } from "@/features/auth/components/SignupFormContainer";

export const metadata: Metadata = {
    title: "Sign up",
};

export default function SignupPage() {
    return (
        <main className="flex flex-1 items-center justify-center px-6 py-12">
            <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-8 text-foreground">
                <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
                <p className="mt-2 text-sm text-foreground/70">
                    Enter your details to get started.
                </p>

                <div className="mt-8">
                    <SignupFormContainer />
                </div>
            </div>
        </main>
    );
}
