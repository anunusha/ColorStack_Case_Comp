"use client";

import { useTranslation } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function LanguageToggle({ className }) {
  const { lang, setLang } = useTranslation();

  return (
    <div
      className={cn(
        "inline-flex overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--palette-white)] text-sm shadow-sm",
        className
      )}
      role="group"
      aria-label={lang === "hi" ? "भाषा चुनें" : "Language"}
    >
      <button
        type="button"
        className={cn(
          "px-3 py-1.5 font-medium transition-colors",
          lang === "en"
            ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
            : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
        )}
        onClick={() => setLang("en")}
        aria-label="Switch to English"
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        type="button"
        className={cn(
          "px-3 py-1.5 font-medium transition-colors",
          lang === "hi"
            ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
            : "text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
        )}
        onClick={() => setLang("hi")}
        aria-label="हिन्दी में बदलें"
        aria-pressed={lang === "hi"}
      >
        हिन्दी
      </button>
    </div>
  );
}
