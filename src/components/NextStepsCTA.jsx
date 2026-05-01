"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NEXT_STEPS = {
  student: {
    heading: "You're ready to claim these. Here's what to do next:",
    primary: {
      label: "File for free with Wealthsimple Tax",
      url: "https://www.wealthsimple.com/en-ca/tax",
      description: "Free tax filing software, CRA-certified. Takes around 30 minutes for many students.",
    },
    secondary: {
      label: "Find a free CVITP clinic near you",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/community-volunteer-income-tax-program.html",
      description: "Free help from a trained volunteer, in person.",
    },
  },
  dtc: {
    heading: "You're ready to apply. Here's what to do next:",
    primary: {
      label: "Download Form T2201 (CRA)",
      url: "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t2201.html",
      description:
        "Official Disability Tax Credit application form to bring to your medical practitioner appointment.",
    },
    secondary: {
      label: "Find resources from Plan Institute",
      url: "https://www.rdsp.com/",
      description: "Free guidance on DTC applications and RDSP next steps.",
    },
  },
};

export default function NextStepsCTA({ audience }) {
  const config = NEXT_STEPS[audience];

  if (!config) {
    return null;
  }

  return (
    <Card className="mt-8 border-2 border-[var(--color-primary)] bg-[color-mix(in_oklab,var(--color-primary)_8%,white)] shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-2xl leading-tight text-[var(--color-foreground)]">{config.heading}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <a
          className="block rounded-xl bg-[var(--color-primary)] p-4 text-[var(--color-primary-foreground)] transition hover:brightness-95"
          href={config.primary.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <p className="text-base font-semibold text-white">{config.primary.label} &#8594;</p>
          <p className="mt-1 text-sm text-white/90">{config.primary.description}</p>
        </a>

        <a
          className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-[var(--color-foreground)] transition hover:bg-[var(--color-secondary)]"
          href={config.secondary.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <p className="text-base font-semibold">{config.secondary.label} &#8594;</p>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{config.secondary.description}</p>
        </a>

        <p className="text-caption text-[var(--color-muted-foreground)]">
          TaxBridge does not file taxes for you. It points you to trusted free options.
        </p>
      </CardContent>
    </Card>
  );
}
