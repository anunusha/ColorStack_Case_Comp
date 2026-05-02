"use client";

import { useRouter } from "next/navigation";

import CounterDisplay from "@/components/CounterDisplay";
import FaqStrip from "@/components/landing/FaqStrip";
import HowItWorksSteps from "@/components/landing/HowItWorksSteps";
import PageShell from "@/components/PageShell";
import exampleAnswers from "@/data/example_answers.json";
import { useTranslation } from "@/lib/i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const barrierKeys = ["landing.barriers.1", "landing.barriers.2", "landing.barriers.3"];

export default function Landing() {
  const router = useRouter();
  const { t } = useTranslation();

  function loadExample() {
    window.sessionStorage.setItem("taxbridge-intake", JSON.stringify(exampleAnswers.student));
    router.push("/results?example=true");
  }

  return (
    <PageShell className="gap-20 py-12 lg:py-20">
      <section className="hero-banner grid gap-12 rounded-2xl border-2 border-[var(--palette-black)] p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-10 xl:p-12">
        <div className="grid gap-10">
          <div className="grid gap-5">
            <Badge className="w-fit" variant="secondary">
              {t("landing.hero.badge")}
            </Badge>
            <h1 className="max-w-3xl text-display text-[var(--color-foreground)]">
              {t("landing.hero.stat")}
            </h1>
            <p className="max-w-2xl text-body-lg text-[var(--color-muted-foreground)]">
              {t("landing.hero.subtitle")}
            </p>
          </div>

          <div className="grid gap-3 sm:max-w-xl sm:grid-cols-2">
            <Button className="h-12" onClick={() => router.push("/intake/student")}>
              {t("landing.cta.student")}
            </Button>
            <Button className="h-12" onClick={() => router.push("/intake/dtc")} variant="outline">
              {t("landing.cta.dtc")}
            </Button>
          </div>

          <button
            className="w-fit text-sm font-semibold text-[var(--color-primary)] transition hover:underline"
            onClick={loadExample}
            type="button"
          >
            {t("landing.example.cta")}
          </button>
        </div>

        <Card className="border-[var(--color-border)] shadow-[var(--shadow-card)]">
          <CardHeader className="gap-3">
            <Badge className="w-fit" variant="secondary">
              {t("landing.card.badge")}
            </Badge>
            <CardTitle className="text-3xl">{t("landing.card.title")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <p className="leading-7 text-[var(--color-muted-foreground)]">{t("landing.card.body")}</p>
            <CounterDisplay />
          </CardContent>
        </Card>
      </section>

      <HowItWorksSteps />

      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="grid gap-2">
          <Badge className="w-fit" variant="secondary">
            {t("landing.why.badge")}
          </Badge>
          <h2 className="text-section-title text-[var(--color-foreground)]">{t("landing.why.title")}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {barrierKeys.map((key) => (
            <Card
              className="border-[var(--color-border)] bg-[var(--palette-white)] shadow-sm"
              key={key}
            >
              <CardContent className="p-5">
                <p className="font-semibold leading-7 text-[var(--color-foreground)]">{t(key)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <FaqStrip />

      <footer className="rounded-xl border border-[var(--color-border)] bg-[var(--palette-white)] p-6 text-caption leading-relaxed text-[var(--color-muted-foreground)]">
        <p className="font-semibold text-[var(--color-foreground)]">{t("landing.disclosures.title")}</p>
        <p className="mt-2">{t("landing.disclosures.body")}</p>
      </footer>
    </PageShell>
  );
}
