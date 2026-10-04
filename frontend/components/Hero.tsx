import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center">
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
        Secure. Simple.{" "}
        <span className="text-primary">Swift.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        Protect your digital identity with a password manager built for speed
        and security. Your vault is encrypted in your browser before it ever
        leaves your device.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/register"
          className="rounded-md bg-primary px-8 py-3 font-semibold text-primary-foreground hover:opacity-90"
        >
          Get started
        </Link>
        <Link
          href="/#how-it-works"
          className="rounded-md border border-border px-8 py-3 font-semibold hover:bg-accent"
        >
          See how it works
        </Link>
      </div>
    </section>
  );
}