import Link from "next/link";
import { Logo } from "@/components/Logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/experts", label: "Our experts" },
      { href: "/categories", label: "Categories" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/signup/expert", label: "Become an expert" },
      { href: "/signup", label: "Create account" },
      { href: "/login", label: "Sign in" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-fg-muted">
              Knowledge has value. WitHub turns it into an asset.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-medium uppercase tracking-wide text-fg-subtle">
                  {col.title}
                </p>
                <ul className="mt-3 flex flex-col gap-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-fg-muted transition-colors hover:text-fg"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-10 text-xs text-fg-subtle">
          &copy; {new Date().getFullYear()} WitHub. All rights reserved. This is an MVP demo — all data shown is simulated.
        </p>
      </div>
    </footer>
  );
}
