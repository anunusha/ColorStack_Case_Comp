"use client";

import { useTranslation } from "@/lib/i18n";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[var(--color-sidebar-border)] bg-[var(--color-card)] px-4 py-6 text-sm text-[var(--color-muted-foreground)] sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Separator className="mb-5" />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-[var(--color-foreground)]">TaxBridge</p>
          <p className="max-w-3xl leading-relaxed">{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  );
}
