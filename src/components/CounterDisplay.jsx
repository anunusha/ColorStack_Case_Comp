"use client";

import { useEffect, useState } from "react";

import { DEFAULT_COUNTERS, getCounters } from "@/lib/supabaseClient";
import ImpactStatCard from "@/components/ImpactStatCard";

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
    { label: "people guided", value: formatNumber(counters.users_served) },
    {
      label: "credits identified",
      value: formatNumber(counters.credits_identified),
    },
    {
      label: "estimated dollars surfaced",
      value: formatCurrency(counters.dollars_unlocked),
    },
  ];

  return (
    <section
      aria-label="TaxBridge impact counters"
      className="grid gap-3 sm:grid-cols-3"
    >
      {displayCounters.map((counter) => (
        <ImpactStatCard
          key={counter.label}
          label={counter.label}
          value={counter.value}
        />
      ))}
    </section>
  );
}
