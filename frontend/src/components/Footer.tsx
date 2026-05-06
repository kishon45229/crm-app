import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full border-t border-black/[.08] dark:border-white/[.145]">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    © {new Date().getFullYear()} SalesCRM. All rights reserved.
                </p>

                <div className="flex items-center gap-4 text-sm">
                    <Link
                        href="/login"
                        className="text-zinc-600 hover:text-foreground dark:text-zinc-400"
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="text-zinc-600 hover:text-foreground dark:text-zinc-400"
                    >
                        Signup
                    </Link>
                </div>
            </div>
        </footer>
    );
}
