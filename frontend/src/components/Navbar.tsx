import Link from "next/link";

export default function Navbar() {
    return (
        <header className="w-full border-b">
            <div className="mx-auto flex w-full max-w-full items-center justify-between px-6 py-4">
                <Link href="/" className="text-sm font-semibold tracking-tight">
                    SalesCRM
                </Link>

                <nav className="flex items-center gap-6 text-sm">
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
                        SignUp
                    </Link>
                </nav>
            </div>
        </header>
    );
}
