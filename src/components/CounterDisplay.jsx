"use client";

import { useEffect, useState } from "react";

import ImpactStatCard from "@/components/ImpactStatCard";
import { useTranslation } from "@/lib/i18n";
import { DEFAULT_COUNTERS, getCounters } from "@/lib/supabaseClient";

function formatNumber(value) {
  return Number(value || 0).toLocaleString("en-CA");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function CounterDisplay() {
  const { t } = useTranslation();
  const [counters, setCounters] = useState(DEFAULT_COUNTERS);

  useEffect(() => {
    let isCancelled = false;

    async function loadCounters() {
      const liveCounters = await getCounters();

      if (!isCancelled) {
        setCounters(liveCounters);
      }
    }

    loadCounters();

    return () => {
      isCancelled = true;
    };
  }, []);

  const displayCounters = [
    { labelKey: "counter.people_guided", value: formatNumber(counters.users_served) },
    {
      labelKey: "counter.credits_identified",
      value: formatNumber(counters.credits_identified),
    },
    {
      labelKey: "counter.dollars_surfaced",
      value: formatCurrency(counters.dollars_unlocked),
    },
  ];

  return (
    <section aria-label={t("counter.aria")} className="grid gap-3 sm:grid-cols-3">
      {displayCounters.map((counter) => (
        <ImpactStatCard
          key={counter.labelKey}
          label={t(counter.labelKey)}
          value={counter.value}
        />
      ))}
    </section>
  );
}
