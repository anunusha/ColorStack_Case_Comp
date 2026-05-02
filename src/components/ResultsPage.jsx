"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import DeepLinkDialog from "@/components/DeepLinkDialog";
import EmptyState from "@/components/EmptyState";
import NextStepsCTA from "@/components/NextStepsCTA";
import PageShell from "@/components/PageShell";
import { generatePDF } from "@/components/PDFChecklist";
import ResultCreditCard from "@/components/ResultCreditCard";
import SectionHeader from "@/components/SectionHeader";
import { explainCredits } from "@/lib/claudeClient";
import { useTranslation } from "@/lib/i18n";
import { mergeLocalizedCredits } from "@/lib/localizedData";
import { matchCredits } from "@/lib/matchingEngine";
import { incrementCounters } from "@/lib/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function audienceResultLabel(t, audience) {
  if (audience === "student") return t("results.audience.student");
  if (audience === "dtc") return t("results.audience.dtc");
  return t("results.audience.fallback");
}

export default function ResultsPage() {
  const { t, lang } = useTranslation();
  const searchParams = useSearchParams();
  const isExample = searchParams.get("example") === "true";
  const [eligibleCredits, setEligibleCredits] = useState([]);
  const [intakeState] = useState(() => {
    if (typeof window === "undefined") {
      return { raw: null, data: null };
    }

    const savedIntake = window.sessionStorage.getItem("taxbridge-intake");

    if (!savedIntake) {
      return { raw: null, data: null };
    }

    try {
      return {
        raw: savedIntake,
        data: JSON.parse(savedIntake),
      };
    } catch {
      return { raw: null, data: null };
    }
  });
  const [isLoading, setIsLoading] = useState(Boolean(intakeState.data));
  const [loadError, setLoadError] = useState(null);
  const incrementedSessionsRef = useRef(new Set());
  const intakeSessionKey = intakeState.raw;
  const intakeData = intakeState.data;

  const estimatedTotal = useMemo(
    () =>
      eligibleCredits.reduce(
        (total, credit) =>
          total +
          (typeof credit.computed_estimate?.value === "number"
            ? credit.computed_estimate.value
            : 0),
        0
      ),
    [eligibleCredits]
  );

  useEffect(() => {
    if (!intakeData) {
      return;
    }

    let isCancelled = false;

    async function loadResults() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const matchedCredits = matchCredits(intakeData.audience, intakeData.answers);
        const localizedCredits = mergeLocalizedCredits(
          matchedCredits,
          intakeData.audience,
          lang,
          intakeData.answers
        );
        const explainedCredits = await explainCredits(localizedCredits, {
          audience: intakeData.audience,
          answers: intakeData.answers,
          lang,
        });

        if (isCancelled) {
          return;
        }

        setEligibleCredits(explainedCredits);

        const dollarsAmount = explainedCredits.reduce(
          (total, credit) =>
            total +
            (typeof credit.computed_estimate?.value === "number"
              ? credit.computed_estimate.value
              : 0),
          0
        );

        if (
          !isExample &&
          intakeSessionKey &&
          !incrementedSessionsRef.current.has(intakeSessionKey)
        ) {
          incrementCounters(explainedCredits.length, dollarsAmount);
          incrementedSessionsRef.current.add(intakeSessionKey);
        }

        setIsLoading(false);
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setLoadError(error);
        setEligibleCredits([]);
        setIsLoading(false);
      }
    }

    loadResults();

    return () => {
      isCancelled = true;
    };
  }, [intakeData, intakeSessionKey, isExample, lang]);

  if (!intakeData && !isLoading) {
    return (
      <PageShell className="max-w-4xl">
        <EmptyState
          description={t("results.empty.description")}
          primaryAction={{ href: "/", label: t("results.empty.cta") }}
          title={t("results.empty.title")}
        />
      </PageShell>
    );
  }

  const audienceKey = intakeData?.audience;

  return (
    <PageShell>
      <Button asChild className="mb-8 w-fit" variant="link">
        <Link href="/">{t("results.back_home")}</Link>
      </Button>

      {isExample ? (
        <Card className="mb-8 border-[var(--color-primary)] bg-[color-mix(in_oklab,var(--color-primary)_10%,white)] shadow-sm">
          <CardContent className="p-4 text-sm leading-6 text-[var(--color-foreground)]">
            <span className="font-semibold">{t("results.example.label")}</span> {t("results.example.lead")}{" "}
            <span className="font-semibold">
              {intakeData?.persona_label ?? t("results.example.persona_fallback")}
            </span>{" "}
            {t("results.example.would_see")}{" "}
            <Link className="font-semibold underline" href="/">
              {t("results.example.cta")}
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_0.6fr] lg:items-end">
        <SectionHeader
          badge={
            <Badge className="w-fit" variant="secondary">
              {t("results.badge", {
                audience: audienceResultLabel(t, audienceKey),
              })}
            </Badge>
          }
          title={t("results.title")}
          description={t("results.description")}
        />

        <Card className="border-[var(--color-border)] shadow-sm">
          <CardHeader className="gap-2">
            <CardTitle className="text-base text-[var(--color-muted-foreground)]">
              {t("results.estimated_total_label")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <p className="text-4xl font-bold text-[var(--color-foreground)]">
              {isLoading ? "..." : formatCurrency(estimatedTotal)}
            </p>
            <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
              {t("results.estimated_note")}
            </p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <Card className="mt-10 border-[var(--color-border)] shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">{t("results.loading")}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((item) => (
              <Skeleton className="h-40 rounded-xl" key={item} />
            ))}
          </CardContent>
        </Card>
      ) : loadError ? (
        <div className="mt-10">
          <EmptyState
            description={t("results.error.description")}
            primaryAction={{
              href: `/intake/${intakeData?.audience ?? "student"}`,
              label: t("results.retake"),
            }}
            secondaryAction={{ href: "/", label: t("results.back_home") }}
            title={t("results.error.title")}
          />
        </div>
      ) : eligibleCredits.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            description={t("results.no_matches.description")}
            primaryAction={{
              href: `/intake/${intakeData?.audience ?? "student"}`,
              label: t("results.retake"),
            }}
            secondaryAction={{ href: "/", label: t("results.back_home") }}
            title={t("results.no_matches.title")}
          />
        </div>
      ) : (
        <>
          <NextStepsCTA audience={intakeData?.audience} />
          <section className="mt-10 grid gap-5">
            {eligibleCredits.map((credit) => (
              <ResultCreditCard
                credit={credit}
                formattedDollars={
                  credit.computed_estimate?.display ??
                  (typeof credit.estimated_dollars === "number"
                    ? formatCurrency(credit.estimated_dollars)
                    : t("results.not_estimated"))
                }
                key={credit.id}
              />
            ))}
          </section>
        </>
      )}

      <Card className="mt-8 border-[var(--color-border)] shadow-sm">
        <CardHeader className="gap-2">
          <CardTitle className="text-xl">{t("results.pdf.title")}</CardTitle>
          <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">{t("results.pdf.note")}</p>
        </CardHeader>
        <CardContent>
          {isLoading || eligibleCredits.length === 0 ? (
            <Button disabled variant="secondary">
              {t("results.pdf.download")}
            </Button>
          ) : (
            <DeepLinkDialog
              confirmLabel={t("results.pdf.modal.confirm")}
              description={t("results.pdf.modal.description")}
              modalKey="download-checklist"
              onConfirm={() => generatePDF(intakeData?.audience, eligibleCredits, lang, t)}
              title={t("results.pdf.modal.title")}
            >
              {t("results.pdf.download")}
            </DeepLinkDialog>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
