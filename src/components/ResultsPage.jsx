"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import EmptyState from "@/components/EmptyState";
import PageShell from "@/components/PageShell";
import ResultCreditCard from "@/components/ResultCreditCard";
import SectionHeader from "@/components/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const placeholderCredits = {
  student: [
    {
      id: "tuition_credit",
      name: "Tuition Tax Credit",
      estimated_dollars: 400,
      documents_needed: ["T2202 form", "Tuition receipts"],
      filing_destination: "Line 32300 of your T1 return",
      fallback_explanation:
        "Because you paid tuition, you may be able to claim a non-refundable tuition credit. Your next step is to download your T2202 and keep it with your tax documents.",
      eligibility_rules: {
        paid_tuition_2024: true,
      },
    },
    {
      id: "gst_hst_credit",
      name: "GST/HST Credit",
      estimated_dollars: 519,
      documents_needed: ["Social Insurance Number", "Basic income details"],
      filing_destination: "Automatically assessed after filing your return",
      fallback_explanation:
        "If you have modest income, filing a return can unlock quarterly GST/HST credit payments. Your next step is to file even if you do not owe tax.",
      eligibility_rules: {
        has_income: true,
      },
    },
    {
      id: "moving_expenses",
      name: "Moving Expenses Deduction",
      estimated_dollars: 300,
      documents_needed: ["Moving receipts", "Lease or address records"],
      filing_destination: "Line 21900 of your T1 return",
      fallback_explanation:
        "If you moved at least 40 km closer to school or work, some moving costs may be deductible. Your next step is to gather receipts before filing.",
      eligibility_rules: {
        moved_for_school: true,
      },
    },
  ],
  dtc: [
    {
      id: "disability_tax_credit",
      name: "Disability Tax Credit",
      estimated_dollars: 2500,
      documents_needed: ["Form T2201", "Medical practitioner certification"],
      filing_destination: "CRA DTC application, then claimed on your return",
      fallback_explanation:
        "Your answers suggest the DTC may be worth exploring with a medical practitioner. Your next step is to review Form T2201 and ask your practitioner about certification.",
      eligibility_rules: {
        has_impairment: true,
        lasting_12_months: true,
      },
    },
    {
      id: "rdsp_gateway",
      name: "RDSP Access",
      estimated_dollars: 1000,
      documents_needed: ["Approved DTC status", "Bank or credit union appointment"],
      filing_destination: "Registered Disability Savings Plan provider",
      fallback_explanation:
        "DTC approval can unlock access to the RDSP and related government grants. Your next step is to focus on the DTC application first.",
      eligibility_rules: {
        has_impairment: true,
        lasting_12_months: true,
        has_practitioner: true,
      },
    },
  ],
};

const audienceLabels = {
  student: "student",
  dtc: "DTC",
};

function matchCredits(audience, answers) {
  const creditDb = placeholderCredits[audience] ?? [];

  return creditDb
    .filter((credit) =>
      Object.entries(credit.eligibility_rules).every(
        ([ruleKey, ruleValue]) => answers[ruleKey] === ruleValue
      )
    )
    .sort((a, b) => b.estimated_dollars - a.estimated_dollars);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ResultsPage() {
  const [intakeState] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const savedIntake = window.sessionStorage.getItem("taxbridge-intake");

    if (!savedIntake) {
      return null;
    }

    try {
      return JSON.parse(savedIntake);
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        setIsLoading(false);
      } catch (error) {
        setLoadError(error);
        setIsLoading(false);
      }
    }, 600);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const eligibleCredits = useMemo(() => {
    if (!intakeState) {
      return [];
    }

    return matchCredits(intakeState.audience, intakeState.answers);
  }, [intakeState]);

  const estimatedTotal = eligibleCredits.reduce(
    (total, credit) => total + credit.estimated_dollars,
    0
  );

  if (!intakeState && !isLoading) {
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

      <div className="grid gap-8 lg:grid-cols-[1fr_0.6fr] lg:items-end">
        <SectionHeader
          badge={
            <Badge className="w-fit" variant="secondary">
              Results for {audienceLabels[intakeState?.audience] ?? "your pathway"}
            </Badge>
          }
          title="Your likely credits and next steps"
          description="These are prototype estimates based on your answers. Review them before filing and use the documents list as a starting checklist."
        />

        <Card className="shadow-sm">
          <CardHeader className="gap-2">
            <CardTitle className="text-base text-slate-600">
              Estimated total surfaced
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <p className="text-4xl font-bold text-slate-900">
              {isLoading ? "..." : formatCurrency(estimatedTotal)}
            </p>
            <p className="text-sm leading-6 text-slate-600">
              Amounts are rough estimates for demo purposes, not guaranteed refund values.
            </p>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <Card className="mt-10 shadow-sm">
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
              href: `/intake/${intakeState?.audience ?? "student"}`,
              label: "Retake intake",
            }}
            secondaryAction={{ href: "/", label: "Back to home" }}
            title="We couldn't generate results."
          />
        </div>
      ) : eligibleCredits.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            description="Your answers did not trigger the placeholder credit rules. You can still file a return, review CRA guidance, or retake the intake if something was answered incorrectly."
            primaryAction={{
              href: `/intake/${intakeState?.audience ?? "student"}`,
              label: "Retake intake",
            }}
            secondaryAction={{ href: "/", label: "Back to home" }}
            title="No strong matches yet."
          />
        </div>
      ) : (
        <section className="mt-10 grid gap-5">
          {eligibleCredits.map((credit) => (
            <ResultCreditCard
              credit={credit}
              formattedDollars={formatCurrency(credit.estimated_dollars)}
              key={credit.id}
            />
          ))}
        </section>
      )}

      <Card className="mt-8 shadow-sm">
        <CardHeader className="gap-2">
          <CardTitle className="text-xl">Downloadable checklist</CardTitle>
          <p className="text-sm leading-6 text-slate-600">
            PDF generation will connect to Coder B&apos;s module during the merge phase.
          </p>
        </CardHeader>
        <CardContent>
          <Button disabled variant="secondary">
            Download PDF soon
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}
