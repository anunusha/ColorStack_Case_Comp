import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ClipboardCheck, Route, Sparkles } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Pick your pathway",
    description:
      "Student credits or Disability Tax Credit exploration—each flow uses plain language, not CRA jargon.",
    icon: Route,
  },
  {
    n: "02",
    title: "Answer short questions",
    description:
      "Nothing is stored on our servers; answers stay in this browser session for your checklist.",
    icon: BookOpen,
  },
  {
    n: "03",
    title: "Review likely matches",
    description:
      "See credits worth double-checking, rough estimates, and what documents to gather next.",
    icon: Sparkles,
  },
  {
    n: "04",
    title: "Take a checklist with you",
    description:
      "Download a PDF summary for a clinic, trusted helper, or your own filing prep.",
    icon: ClipboardCheck,
  },
];

export default function HowItWorksSteps() {
  return (
    <section aria-labelledby="how-it-works-heading" className="grid gap-8">
      <div className="grid gap-2">
        <p className="text-caption font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
          How it works
        </p>
        <h2 className="text-section-title text-[var(--color-foreground)]" id="how-it-works-heading">
          From uncertainty to next steps
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map(({ n, title, description, icon: Icon }) => (
          <Card className="shadow-[var(--shadow-card)]" key={n}>
            <CardHeader className="gap-4">
              <div className="flex size-11 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--palette-white)]">
                <Icon aria-hidden className="size-5 text-[var(--color-primary)]" />
              </div>
              <CardTitle className="text-lg leading-snug">
                <span className="text-[var(--color-muted-foreground)]">{n}. </span>
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
