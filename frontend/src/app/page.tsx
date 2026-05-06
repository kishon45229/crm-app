import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col max-w-full text-foreground bg-gradient-to-br from-emerald-50 to-zinc-100 dark:from-emerald-950 dark:to-zinc-900">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
