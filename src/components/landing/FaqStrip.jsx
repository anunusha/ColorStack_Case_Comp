"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const faqKeys = [
  { q: "faq.1.q", a: "faq.1.a" },
  { q: "faq.2.q", a: "faq.2.a" },
  { q: "faq.3.q", a: "faq.3.a" },
  { q: "faq.4.q", a: "faq.4.a" },
];

export default function FaqStrip() {
  const { t } = useTranslation();
  const stripRef = useRef(null);

  function scrollByDirection(dir) {
    const el = stripRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 320);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  return (
    <section aria-labelledby="faq-heading" className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-2">
          <p className="text-caption font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {t("faq.kicker")}
          </p>
          <h2 className="text-section-title text-[var(--color-foreground)]" id="faq-heading">
            {t("faq.title")}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            aria-label={t("faq.prev")}
            className="size-10 shrink-0 p-0"
            onClick={() => scrollByDirection(-1)}
            type="button"
            variant="outline"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            aria-label={t("faq.next")}
            className="size-10 shrink-0 p-0"
            onClick={() => scrollByDirection(1)}
            type="button"
            variant="outline"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="faq-strip flex gap-4 overflow-x-auto pb-2" ref={stripRef} tabIndex={0}>
        {faqKeys.map(({ q, a }) => (
          <Card
            className="min-w-[min(100%,280px)] max-w-[320px] shrink-0 shadow-[var(--shadow-card)] sm:min-w-[280px]"
            key={q}
          >
            <CardContent className="flex h-full flex-col gap-6 p-6">
              <p className="font-semibold leading-snug text-[var(--color-foreground)]">{t(q)}</p>
              <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">{t(a)}</p>
              <Link
                className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                href="/intake/student"
              >
                {t("faq.start_pathway")}
                <span aria-hidden>↗</span>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
