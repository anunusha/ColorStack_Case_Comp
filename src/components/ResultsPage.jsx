"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { explainCredits } from "@/lib/claudeClient";
import { matchCredits } from "@/lib/matchingEngine";
import { incrementCounters } from "@/lib/supabaseClient";
import DeepLinkDialog from "@/components/DeepLinkDialog";
import EmptyState from "@/components/EmptyState";
import NextStepsCTA from "@/components/NextStepsCTA";
import PageShell from "@/components/PageShell";
import { generatePDF } from "@/components/PDFChecklist";
import ResultCreditCard from "@/components/ResultCreditCard";
import SectionHeader from "@/components/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const audienceLabels = {
  student: "student",
  dtc: "DTC",
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ResultsPage() {
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
        const explainedCredits = await explainCredits(matchedCredits, {
          audience: intakeData.audience,
          answers: intakeData.answers,
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
  }, [intakeData, intakeSessionKey, isExample]);

  if (!intakeData && !isLoading) {
    return (
      <PageShell className="max-w-4xl">
        <EmptyState
          description="Results are generated from answers stored only in this browser session. Start a pathway to create your checklist."
          primaryAction={{ href: "/", label: "Go to landing page" }}
          title="Start with a few questions first."
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Button asChild className="mb-8 w-fit" variant="link">
        <Link href="/">Back to home</Link>
      </Button>

      {isExample ? (
        <Card className="mb-8 border-[var(--color-primary)] bg-[color-mix(in_oklab,var(--color-primary)_10%,white)] shadow-sm">
          <CardContent className="p-4 text-sm leading-6 text-[var(--color-foreground)]">
            <span className="font-semibold">Example results</span> - showing what{" "}
            <span className="font-semibold">{intakeData?.persona_label ?? "an example student"}</span> would
            see.{" "}
            <Link className="font-semibold underline" href="/">
              Try with your own info &#8594;
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_0.6fr] lg:items-end">
        <SectionHeader
          badge={
            <Badge className="w-fit" variant="secondary">
              Results for {audienceLabels[intakeData?.audience] ?? "your pathway"}
            </Badge>
          }
          title="Your likely credits and next steps"
          description="These are prototype estimates based on your answers. Review them before filing and use the documents list as a starting checklist."
        />

        <Card className="border-[var(--color-border)] shadow-sm">
          <CardHeader className="gap-2">
            <CardTitle className="text-base text-[var(--color-muted-foreground)]">
              Estimated total surfaced
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <p className="text-4xl font-bold text-[var(--color-foreground)]">
              {isLoading ? "..." : formatCurrency(estimatedTotal)}
            </p>
            <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
              Amounts are rough estimates for demo purposes, not guaranteed refund values.
            </p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <Card className="mt-10 border-[var(--color-border)] shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">
              Matching credits and drafting plain-English explanations...
            </CardTitle>
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
            description="Something went wrong while generating your results in this browser session. You can safely try again."
            primaryAction={{
              href: `/intake/${intakeData?.audience ?? "student"}`,
              label: "Retake intake",
            }}
            secondaryAction={{ href: "/", label: "Back to home" }}
            title="We couldn't generate results."
          />
        </div>
      ) : eligibleCredits.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            description="Your answers did not trigger the current credit matching rules. You can still file a return, review CRA guidance, or retake the intake if something was answered incorrectly."
            primaryAction={{
              href: `/intake/${intakeData?.audience ?? "student"}`,
              label: "Retake intake",
            }}
            secondaryAction={{ href: "/", label: "Back to home" }}
            title="No strong matches yet."
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
                    : "Not estimated")
                }
                key={credit.id}
              />
            ))}
          </section>
        </>
      )}

      <Card className="mt-8 border-[var(--color-border)] shadow-sm">
        <CardHeader className="gap-2">
          <CardTitle className="text-xl">Downloadable checklist</CardTitle>
          <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
            Review before generating so you can cancel if needed.
          </p>
        </CardHeader>
        <CardContent>
          {isLoading || eligibleCredits.length === 0 ? (
            <Button disabled variant="secondary">
              Download PDF
            </Button>
          ) : (
            <DeepLinkDialog
              confirmLabel="Generate PDF"
              description="This will download your checklist locally. You can cancel now if you need to review your results first."
              modalKey="download-checklist"
              onConfirm={() => generatePDF(intakeData?.audience, eligibleCredits)}
              title="Generate checklist PDF?"
            >
              Download PDF
            </DeepLinkDialog>
          )}
        </CardContent>
      </Card>
    </PageShell>
  );
}
