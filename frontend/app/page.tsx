import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Link from "next/link";

export default function Page() {
  return (
    <main>
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <span className="text-lg font-bold">GSTR</span>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <Hero />
      <HowItWorks />

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Yusuf Ahmed
      </footer>
    </main>
  );
}