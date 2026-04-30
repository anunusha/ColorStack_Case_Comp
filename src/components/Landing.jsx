import CounterDisplay from "@/components/CounterDisplay";
import AudienceCard from "@/components/AudienceCard";
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
    <div className="overflow-hidden">
      <PageShell className="py-16 lg:py-24">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
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
                  key={card.href}
                  href={card.href}
                  eyebrow={card.eyebrow}
                  title={card.title}
                  description={card.description}
                />
              ))}
            </div>
          </div>

          <Card className="border-slate-200 shadow-xl shadow-slate-100/80">
            <CardHeader className="gap-3">
              <Badge className="w-fit" variant="secondary">
                Prototype impact
              </Badge>
              <CardTitle className="text-3xl">
                Built to close the awareness gap.
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <p className="leading-7 text-slate-600">
                Many people miss credits because the system assumes they already
                know the forms, lines, and benefit names. TaxBridge starts with
                life situations instead.
              </p>
              <CounterDisplay />
            </CardContent>
          </Card>
        </section>
      </PageShell>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <Badge className="w-fit" variant="secondary">
              Why it helps
            </Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              TaxBridge turns uncertainty into next steps.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {barriers.map((barrier) => (
              <Card className="border-slate-200 bg-slate-50" key={barrier}>
                <CardContent className="p-5">
                  <p className="font-semibold leading-7 text-slate-800">
                    {barrier}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
