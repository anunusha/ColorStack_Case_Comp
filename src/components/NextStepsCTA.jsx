"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";

const NEXT_STEP_KEYS = {
  student: {
    headingKey: "nextSteps.student.heading",
    primary: {
      labelKey: "nextSteps.student.primary.label",
      url: "https://www.wealthsimple.com/en-ca/tax",
      descriptionKey: "nextSteps.student.primary.desc",
    },
    secondary: {
      labelKey: "nextSteps.student.secondary.label",
      url: "https://www.canada.ca/en/revenue-agency/services/tax/individuals/community-volunteer-income-tax-program.html",
      descriptionKey: "nextSteps.student.secondary.desc",
    },
  },
  dtc: {
    headingKey: "nextSteps.dtc.heading",
    primary: {
      labelKey: "nextSteps.dtc.primary.label",
      url: "https://www.canada.ca/en/revenue-agency/services/forms-publications/forms/t2201.html",
      descriptionKey: "nextSteps.dtc.primary.desc",
    },
    secondary: {
      labelKey: "nextSteps.dtc.secondary.label",
      url: "https://www.rdsp.com/",
      descriptionKey: "nextSteps.dtc.secondary.desc",
    },
  },
};

export default function NextStepsCTA({ audience }) {
  const { t } = useTranslation();
  const config = NEXT_STEP_KEYS[audience];

  if (!config) {
    return null;
  }

  return (
    <Card className="mt-8 border-2 border-[var(--color-primary)] bg-[color-mix(in_oklab,var(--color-primary)_8%,white)] shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="text-2xl leading-tight text-[var(--color-foreground)]">
          {t(config.headingKey)}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <a
          className="block rounded-xl bg-[var(--color-primary)] p-4 text-[var(--color-primary-foreground)] transition hover:brightness-95"
          href={config.primary.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <p className="text-base font-semibold text-white">
            {t(config.primary.labelKey)} &#8594;
          </p>
          <p className="mt-1 text-sm text-white/90">{t(config.primary.descriptionKey)}</p>
        </a>

        <a
          className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 text-[var(--color-foreground)] transition hover:bg-[var(--color-secondary)]"
          href={config.secondary.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <p className="text-base font-semibold">
            {t(config.secondary.labelKey)} &#8594;
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            {t(config.secondary.descriptionKey)}
          </p>
        </a>

        <p className="text-caption text-[var(--color-muted-foreground)]">{t("nextSteps.footer")}</p>
      </CardContent>
    </Card>
  );
}
