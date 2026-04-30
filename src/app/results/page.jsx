import Link from "next/link";

export default function ResultsPage() {
  return (
    <main className="mx-auto flex min-h-full max-w-5xl flex-col px-6 py-16">
      <Link className="mb-8 text-sm font-semibold text-blue-700" href="/">
        Back to home
      </Link>
      <p className="mb-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 w-fit">
        Results shell
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-slate-950">
        Your TaxBridge results
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
        Phase 1 route is working. Matched credits, explanations, totals, and
        PDF download controls will be added in later phases.
      </p>
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Placeholder total
          </p>
          <p className="mt-3 text-3xl font-bold text-slate-950">$0</p>
        </div>
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            Placeholder credit card
          </p>
          <p className="mt-3 text-xl font-semibold text-slate-900">
            Eligible credits will appear here.
          </p>
        </div>
      </section>
    </main>
  );
}
