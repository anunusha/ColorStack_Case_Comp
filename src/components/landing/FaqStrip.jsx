"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  {
    q: "Is TaxBridge official CRA advice?",
    a: "No—it's an educational prototype to surface credits you may want to verify before filing.",
  },
  {
    q: "Do you store my answers?",
    a: "Answers stay in your browser session only; we don't persist personal data on a server for this demo.",
  },
  {
    q: "Can I undo if I tap the wrong option?",
    a: "Yes—use Back during intake, or retake the pathway from the results screen.",
  },
  {
    q: "What should I do after this?",
    a: "Bring your checklist to CVITP, a trusted preparer, or CRA resources linked in the footer.",
  },
];

export default function FaqStrip() {
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
            FAQ
          </p>
          <h2 className="text-section-title text-[var(--color-foreground)]" id="faq-heading">
            Quick answers
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            aria-label="Previous questions"
            className="size-10 shrink-0 p-0"
            onClick={() => scrollByDirection(-1)}
            type="button"
            variant="outline"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            aria-label="Next questions"
            className="size-10 shrink-0 p-0"
            onClick={() => scrollByDirection(1)}
            type="button"
            variant="outline"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div
        className="faq-strip flex gap-4 overflow-x-auto pb-2"
        ref={stripRef}
        tabIndex={0}
      >
        {faqs.map(({ q, a }) => (
          <Card
            className="min-w-[min(100%,280px)] max-w-[320px] shrink-0 shadow-[var(--shadow-card)] sm:min-w-[280px]"
            key={q}
          >
            <CardContent className="flex h-full flex-col gap-6 p-6">
              <p className="font-semibold leading-snug text-[var(--color-foreground)]">{q}</p>
              <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">{a}</p>
              <Link
                className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                href="/intake/student"
              >
                Start pathway
                <span aria-hidden>↗</span>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
