import { cn } from "@/lib/utils";

export default function PageShell({ className, children }) {
  return (
    <main className={cn("mx-auto flex min-h-full max-w-6xl flex-col px-6 py-16", className)}>
      {children}
    </main>
  );
}

