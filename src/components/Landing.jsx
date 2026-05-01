import AudienceCard from "@/components/AudienceCard";
import CounterDisplay from "@/components/CounterDisplay";
import FaqStrip from "@/components/landing/FaqStrip";
import HowItWorksSteps from "@/components/landing/HowItWorksSteps";
import PageShell from "@/components/PageShell";
import SectionHeader from "@/components/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const audienceCards = [
  {
    href: "/intake/student",
    eyebrow: "Student pathway",
    title: "I'm a student",
    description:
      "Check tuition credits, GST/HST benefits, moving expenses, and student-specific filing opportunities.",
  },
  {
    href: "/intake/dtc",
    eyebrow: "DTC pathway",
    title: "I'm exploring the DTC",
    description:
      "Understand Disability Tax Credit next steps, document needs, and related benefits in plain English.",
  },
];

const barriers = [
  "Plain-English questions instead of CRA jargon",
  "No accounts, no stored answers, no personal data collection",
  "A checklist you can bring to a free filing clinic or trusted helper",
];

export default function Landing() {
  return (
    <PageShell className="gap-20 py-12 lg:py-20">
      <section className="hero-banner grid gap-12 rounded-2xl border-2 border-[var(--palette-black)] p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-10 xl:p-12">
        <div className="grid gap-10">
          <SectionHeader
            badge={
              <Badge className="w-fit" variant="secondary">
                Free tax credit guidance for underserved Canadians
              </Badge>
            }
            title="Find the tax credits you might be missing."
            description="TaxBridge asks simple questions, identifies likely credits and refunds, and gives you a personalized checklist for what to gather before filing."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {audienceCards.map((card) => (
              <AudienceCard
                description={card.description}
                eyebrow={card.eyebrow}
                href={card.href}
                key={card.href}
                title={card.title}
              />
            ))}
          </div>
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
