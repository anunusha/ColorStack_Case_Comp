"use client";

import { BookOpen, ClipboardCheck, Route, Sparkles } from "lucide-react";

import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  { n: "01", titleKey: "howItWorks.1.title", descKey: "howItWorks.1.desc", icon: Route },
  { n: "02", titleKey: "howItWorks.2.title", descKey: "howItWorks.2.desc", icon: BookOpen },
  { n: "03", titleKey: "howItWorks.3.title", descKey: "howItWorks.3.desc", icon: Sparkles },
  { n: "04", titleKey: "howItWorks.4.title", descKey: "howItWorks.4.desc", icon: ClipboardCheck },
];

export default function HowItWorksSteps() {
  const { t } = useTranslation();

  return (
    <section aria-labelledby="how-it-works-heading" className="grid gap-8">
      <div className="grid gap-2">
        <p className="text-caption font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
          {t("howItWorks.kicker")}
        </p>
        <h2 className="text-section-title text-[var(--color-foreground)]" id="how-it-works-heading">
          {t("howItWorks.title")}
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map(({ n, titleKey, descKey, icon: Icon }) => (
          <Card className="shadow-[var(--shadow-card)]" key={n}>
            <CardHeader className="gap-4">
              <div className="flex size-11 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--palette-white)]">
                <Icon aria-hidden className="size-5 text-[var(--color-primary)]" />
              </div>
              <CardTitle className="text-lg leading-snug">
                <span className="text-[var(--color-muted-foreground)]">{n}. </span>
                {t(titleKey)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">{t(descKey)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
