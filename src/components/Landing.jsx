"use client";

import { useRouter } from "next/navigation";

import CounterDisplay from "@/components/CounterDisplay";
import FaqStrip from "@/components/landing/FaqStrip";
import HowItWorksSteps from "@/components/landing/HowItWorksSteps";
import PageShell from "@/components/PageShell";
import exampleAnswers from "@/data/example_answers.json";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const barriers = [
  "Plain-English questions instead of CRA jargon",
  "No accounts, no stored answers, no personal data collection",
  "A checklist you can bring to a free filing clinic or trusted helper",
];

export default function Landing() {
  const router = useRouter();

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
              The hidden cost of not knowing
            </Badge>
            <h1 className="max-w-3xl text-display text-[var(--color-foreground)]">
              Most students leave <span className="text-[var(--color-primary)]">$400-$1,500</span> in tax
              credits unclaimed every year.
            </h1>
            <p className="max-w-2xl text-body-lg text-[var(--color-muted-foreground)]">
              TaxBridge tells you what you&apos;re missing in 5 minutes.
            </p>
          </div>

          <div className="grid gap-3 sm:max-w-xl sm:grid-cols-2">
            <Button className="h-12" onClick={() => router.push("/intake/student")}>
              I&apos;m a student
            </Button>
            <Button className="h-12" onClick={() => router.push("/intake/dtc")} variant="outline">
              I&apos;m exploring the DTC
            </Button>
          </div>

          <button
            className="w-fit text-sm font-semibold text-[var(--color-primary)] transition hover:underline"
            onClick={loadExample}
            type="button"
          >
            See what an example student gets back &#8594;
          </button>
        </div>

        <Card className="border-[var(--color-border)] shadow-[var(--shadow-card)]">
          <CardHeader className="gap-3">
            <Badge className="w-fit" variant="secondary">
              Prototype impact
            </Badge>
            <CardTitle className="text-3xl">Built to close the awareness gap.</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <p className="leading-7 text-[var(--color-muted-foreground)]">
              Many people miss credits because the system assumes they already know the forms, lines, and
              benefit names. TaxBridge starts with life situations instead.
            </p>
            <CounterDisplay />
          </CardContent>
        </Card>
      </section>

      <HowItWorksSteps />

      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div className="grid gap-2">
          <Badge className="w-fit" variant="secondary">
            Why it helps
          </Badge>
          <h2 className="text-section-title text-[var(--color-foreground)]">
            TaxBridge turns uncertainty into next steps.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {barriers.map((barrier) => (
            <Card
              className="border-[var(--color-border)] bg-[var(--palette-white)] shadow-sm"
              key={barrier}
            >
              <CardContent className="p-5">
                <p className="font-semibold leading-7 text-[var(--color-foreground)]">{barrier}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <FaqStrip />

      <footer className="rounded-xl border border-[var(--color-border)] bg-[var(--palette-white)] p-6 text-caption leading-relaxed text-[var(--color-muted-foreground)]">
        <p className="font-semibold text-[var(--color-foreground)]">Disclosures</p>
        <p className="mt-2">
          TaxBridge is an educational prototype—not tax, legal, or financial advice. Estimates are for demo
          purposes only; eligibility depends on your full return and CRA rules. Always verify credits with
          official guidance or a qualified professional before filing.
        </p>
      </footer>
    </PageShell>
  );
}
