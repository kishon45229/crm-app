import type { Metadata } from "next";
import Link from "next/link";

import { SignupFormContainer } from "@/features/auth/components/SignupFormContainer";

export const metadata: Metadata = {
    title: "Sign up",
};

export default function SignupPage() {
    return (
        <main className="flex flex-1 items-center justify-center bg-gradient-to-br from-emerald-50 to-zinc-100 px-6 py-12 sm:py-16 dark:from-emerald-950 dark:to-zinc-900">
            <div className="w-full max-w-md rounded-2xl border border-foreground/10 bg-background p-6 text-foreground shadow-lg sm:p-8">
                <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
                <p className="mt-2 text-sm text-foreground/70">
                    Enter your details to get started.
                </p>

                <div className="mt-8">
                    <SignupFormContainer />
                </div>

                <p className="mt-6 text-sm text-foreground/70">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-emerald-700 hover:underline dark:text-emerald-400"
                    >
                        Sign in
                    </Link>
                </p>

                <p className="mt-3 text-sm">
                    <Link
                        href="/"
                        className="text-foreground/70 hover:text-foreground hover:underline"
                    >
                        Back to home
                    </Link>
                </p>
            </div>
        </main>
    );
}
