const placeholderCounters = [
  { label: "people guided", value: "0" },
  { label: "credits identified", value: "0" },
  { label: "estimated dollars surfaced", value: "$0" },
];

export default function CounterDisplay() {
  return (
    <section
      aria-label="TaxBridge impact counters"
      className="grid gap-3 rounded-3xl border border-blue-100 bg-white/80 p-4 shadow-sm sm:grid-cols-3"
    >
      {placeholderCounters.map((counter) => (
        <div key={counter.label} className="rounded-2xl bg-blue-50 p-4">
          <p className="text-2xl font-bold text-blue-800">{counter.value}</p>
          <p className="mt-1 text-sm font-medium text-slate-600">
            {counter.label}
          </p>
        </div>
      ))}
    </section>
  );
}
