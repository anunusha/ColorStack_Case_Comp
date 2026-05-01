import { cn } from "@/lib/utils";

export default function PageShell({ className, children }) {
  return (
    <main
      className={cn(
        "mx-auto flex min-h-full w-full max-w-6xl flex-col px-4 py-12 sm:px-6 lg:px-8 lg:py-16",
        className
      )}
    >
      {children}
    </main>
  );
}
