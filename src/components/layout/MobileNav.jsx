"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/intake/student", label: "Student" },
  { href: "/intake/dtc", label: "DTC" },
  { href: "/results", label: "Results" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-sidebar-border)] bg-[var(--color-sidebar)] md:hidden">
      <div className="flex items-center justify-between gap-2 px-4 py-3">
        <Link className="font-brand text-lg font-semibold text-[var(--color-foreground)]" href="/">
          TaxBridge
        </Link>
      </div>
      <nav
        aria-label="Primary"
        className="flex gap-2 overflow-x-auto px-4 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {links.map(({ href, label }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-secondary)] text-[var(--color-foreground)]"
                  : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]"
              )}
              href={href}
              key={href}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
