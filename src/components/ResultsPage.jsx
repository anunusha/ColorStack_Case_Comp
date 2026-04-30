"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
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
      <main className="mx-auto flex min-h-full max-w-4xl flex-col px-6 py-16">
        <div className="rounded-[2rem] border border-amber-100 bg-amber-50 p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            No intake found
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Start with a few questions first.
          </h1>
          <p className="mt-4 leading-7 text-slate-700">
            Results are generated from answers stored only in this browser
            session. Start a pathway to create your checklist.
          </p>
          <Link
            className="mt-6 inline-flex rounded-full bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
            href="/"
          >
            Go to landing page
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-full max-w-6xl flex-col px-6 py-16">
      <Link className="mb-8 text-sm font-semibold text-blue-700" href="/">
        Back to home
      </Link>

      <section className="grid gap-8 lg:grid-cols-[1fr_0.6fr] lg:items-end">
        <div>
          <p className="mb-4 w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            Results for {audienceLabels[intakeState?.audience] ?? "your pathway"}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950">
            Your likely credits and next steps
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            These are prototype estimates based on your answers. Review them
            before filing and use the documents list as a starting checklist.
          </p>
        </div>

        <div className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Estimated total surfaced
          </p>
          <p className="mt-3 text-4xl font-bold text-blue-800">
            {isLoading ? "..." : formatCurrency(estimatedTotal)}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Amounts are rough estimates for demo purposes, not guaranteed refund
            values.
          </p>
        </div>
      </section>

      {isLoading ? (
        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-lg font-semibold text-slate-900">
            Matching credits and drafting plain-English explanations...
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                className="h-40 animate-pulse rounded-3xl bg-slate-100"
                key={item}
              />
            ))}
          </div>
        </section>
      ) : eligibleCredits.length === 0 ? (
        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            No strong matches yet.
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Your answers did not trigger the placeholder credit rules. You can
            still file a tax return, review CRA guidance, or try the intake
            again if something was answered incorrectly.
          </p>
          <Link
            className="mt-6 inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-50"
            href={`/intake/${intakeState?.audience ?? "student"}`}
          >
            Retake intake
          </Link>
        </section>
      ) : (
        <section className="mt-10 grid gap-5">
          {eligibleCredits.map((credit) => (
            <article
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
              key={credit.id}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                    Likely match
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950">
                    {credit.name}
                  </h2>
                </div>
                <p className="rounded-full bg-blue-50 px-4 py-2 text-lg font-bold text-blue-800">
                  {formatCurrency(credit.estimated_dollars)}
                </p>
              </div>

              <p className="mt-5 leading-7 text-slate-700">
                {credit.fallback_explanation}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl bg-slate-50 p-5">
                  <h3 className="font-semibold text-slate-950">
                    Documents to gather
                  </h3>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                    {credit.documents_needed.map((document) => (
                      <li key={document}>- {document}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <h3 className="font-semibold text-slate-950">
                    Where it goes
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {credit.filing_destination}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="mt-8 flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950">
            Downloadable checklist
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            PDF generation will connect to Coder B&apos;s module during the
            merge phase.
          </p>
        </div>
        <button
          className="rounded-full bg-slate-200 px-6 py-3 font-semibold text-slate-500"
          disabled
          type="button"
        >
          Download PDF soon
        </button>
      </section>
    </main>
  );
}
