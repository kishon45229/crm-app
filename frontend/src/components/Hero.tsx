import Link from "next/link";
import Image from "next/image";
import ArrowForward from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Hero() {
    return (
        <section className="w-full">
            <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Text Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-100">
                                Streamline Your Sales Pipeline
                            </h1>
                            <p className="text-lg sm:text-xl leading-7 text-zinc-600 dark:text-zinc-400 max-w-prose">
                                Track leads, manage accounts, and follow up consistently—without the clutter. Keep your team focused and your sales moving forward.
                            </p>
                        </div>

                        {/* Features */}
                        <ul className="space-y-3" aria-label="Key features">
                            <li className="flex items-start gap-3">
                                <CheckCircleIcon className="text-emerald-500 mt-0.5" fontSize="small" />
                                <span className="text-zinc-700 dark:text-zinc-300">Easy lead tracking and management</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircleIcon className="text-emerald-500 mt-0.5" fontSize="small" />
                                <span className="text-zinc-700 dark:text-zinc-300">Automated follow-up reminders</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircleIcon className="text-emerald-500 mt-0.5" fontSize="small" />
                                <span className="text-zinc-700 dark:text-zinc-300">Clean, intuitive interface</span>
                            </li>
                        </ul>

                        {/* CTA */}
                        <div className="space-y-4">
                            <Link
                                href="/signup"
                                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-lg bg-emerald-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-900"
                                aria-label="Get started for free"
                            >
                                <span>Get Started Free</span>
                                <ArrowForward fontSize="small" />
                            </Link>

                            <p className="text-base text-zinc-600 dark:text-zinc-400">
                                Already have an account? {" "}
                                <Link href="/login" className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium hover:underline">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-sm sm:max-w-md aspect-square">
                            <Image
                                src="/hero-image.png"
                                alt="Sales CRM Dashboard Preview"
                                fill
                                sizes="(min-width: 1024px) 420px, (min-width: 640px) 360px, 300px"
                                priority
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
