import Link from "next/link";

const Navbar = () => {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold">
          CloudFall
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/vault"
            className="text-muted-foreground transition hover:text-foreground"
          >
            Vault
          </Link>
          <Link
            href="/login"
            className="text-muted-foreground transition hover:text-foreground"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition hover:opacity-90"
          >
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;