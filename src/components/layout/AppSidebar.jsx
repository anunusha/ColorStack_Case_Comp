"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  HeartPulse,
  Home,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";

const trackLinks = [{ href: "/", label: "Home", icon: Home }];

const serviceLinks = [
  { href: "/intake/student", label: "Student pathway", icon: GraduationCap },
  { href: "/intake/dtc", label: "DTC pathway", icon: HeartPulse },
  { href: "/results", label: "Results", icon: ClipboardList },
];

function NavGroup({ title, items, pathname }) {
  return (
    <div className="grid gap-2">
      <p className="text-caption px-3 font-semibold uppercase tracking-wider text-[var(--color-sidebar-muted)]">
        {title}
      </p>
      <nav aria-label={title} className="grid gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-secondary)] text-[var(--color-foreground)]"
                  : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              )}
              href={href}
              key={href}
            >
              <Icon
                aria-hidden
                className={cn(
                  "size-4 shrink-0",
                  active ? "text-[var(--color-primary)]" : "opacity-80"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function AppSidebar({ className }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem("taxbridge.sidebar") === "collapsed";
    } catch {
      return false;
    }
  });

  const toggle = useMemo(
    () => () => {
      setCollapsed((prev) => {
        const next = !prev;
        try {
          window.localStorage.setItem("taxbridge.sidebar", next ? "collapsed" : "expanded");
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar)] px-3 py-8 md:flex",
        collapsed ? "w-20" : "w-60",
        className
      )}
    >
      <div
        className={cn(
          "flex items-start justify-between pb-8",
          collapsed ? "flex-col items-center gap-3 px-1" : "px-3"
        )}
      >
        <Link className="inline-block" href="/">
          <span className="font-brand text-2xl font-semibold tracking-tight text-[var(--color-foreground)]">
            {collapsed ? "TB" : "TaxBridge"}
          </span>
        </Link>
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="mt-1 inline-flex size-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--palette-white)] text-[var(--color-muted-foreground)] transition hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
          onClick={toggle}
          type="button"
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-8 px-1">
        <div className={collapsed ? "hidden" : "block"}>
          <NavGroup items={trackLinks} pathname={pathname} title="Guide" />
        </div>
        <div className={collapsed ? "grid gap-1" : "hidden"} aria-label="Guide">
          {trackLinks.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={cn(
                  "flex items-center justify-center rounded-lg px-3 py-2.5 transition-colors",
                  active ? "bg-[var(--color-secondary)]" : "hover:bg-[var(--color-muted)]"
                )}
              >
                <Icon className={cn("size-4", active ? "text-[var(--color-primary)]" : "text-[var(--color-muted-foreground)]")} />
              </Link>
            );
          })}
        </div>

        <div className={collapsed ? "hidden" : "block"}>
          <NavGroup items={serviceLinks} pathname={pathname} title="Services" />
        </div>
        <div className={collapsed ? "grid gap-1" : "hidden"} aria-label="Services">
          {serviceLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={cn(
                  "flex items-center justify-center rounded-lg px-3 py-2.5 transition-colors",
                  active ? "bg-[var(--color-secondary)]" : "hover:bg-[var(--color-muted)]"
                )}
              >
                <Icon className={cn("size-4", active ? "text-[var(--color-primary)]" : "text-[var(--color-muted-foreground)]")} />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-auto px-1 pt-6">
        <Link
          className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--palette-white)] px-3 py-3 text-sm font-semibold text-[var(--color-foreground)] shadow-sm transition hover:bg-[var(--color-muted)]"
          href="/intake/student"
        >
          <Sparkles className="size-4 text-[var(--color-primary)]" aria-hidden />
          <span className={collapsed ? "sr-only" : "inline"}>Get guidance</span>
        </Link>
      </div>
    </aside>
  );
}
