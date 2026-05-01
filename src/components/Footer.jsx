import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-sidebar-border)] bg-[var(--color-card)] px-4 py-6 text-sm text-[var(--color-muted-foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Separator className="mb-5" />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-[var(--color-foreground)]">TaxBridge</p>
          <p className="max-w-3xl leading-relaxed">
            TaxBridge is an educational prototype, not tax, legal, or financial advice. It helps identify
            credits you may want to review before filing.
          </p>
        </div>
      </div>
    </footer>
  );
}
