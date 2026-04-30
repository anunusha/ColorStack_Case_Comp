import ImpactStatCard from "@/components/ImpactStatCard";

const placeholderCounters = [
  { label: "people guided", value: "0" },
  { label: "credits identified", value: "0" },
  { label: "estimated dollars surfaced", value: "$0" },
];

export default function CounterDisplay() {
  return (
    <section
      aria-label="TaxBridge impact counters"
      className="grid gap-3 sm:grid-cols-3"
    >
      {placeholderCounters.map((counter) => (
        <ImpactStatCard
          key={counter.label}
          label={counter.label}
          value={counter.value}
        />
      ))}
    </section>
  );
}
