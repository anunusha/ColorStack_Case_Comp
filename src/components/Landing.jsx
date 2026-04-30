import Link from "next/link";
import CounterDisplay from "@/components/CounterDisplay";

const audienceCards = [
  {
    href: "/intake/student",
    eyebrow: "Student pathway",
    title: "I'm a student",
    description:
      "Check tuition credits, GST/HST benefits, moving expenses, and student-specific filing opportunities.",
  },
  {
    href: "/intake/dtc",
    eyebrow: "DTC pathway",
    title: "I'm exploring the DTC",
    description:
      "Understand Disability Tax Credit next steps, document needs, and related benefits in plain English.",
  },
];

const barriers = [
  "Plain-English questions instead of CRA jargon",
  "No accounts, no stored answers, no personal data collection",
  "A checklist you can bring to a free filing clinic or trusted helper",
];

export default function Landing() {
  return (
    <main className="overflow-hidden">
      <section className="mx-auto grid min-h-full max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div>
          <p className="mb-5 w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
            Free tax credit guidance for underserved Canadians
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
            Find the tax credits you might be missing.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            TaxBridge asks simple questions, identifies likely credits and
            refunds, and gives you a personalized checklist for what to gather
            before filing.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {audienceCards.map((card) => (
              <Link
                className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
                href={card.href}
                key={card.href}
              >
                <p className="text-sm font-semibold text-blue-700">
                  {card.eyebrow}
                </p>
                <h2 className="mt-3 text-2xl font-bold text-slate-950">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {card.description}
                </p>
                <p className="mt-5 font-semibold text-blue-700">
                  Start intake <span aria-hidden="true">-&gt;</span>
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-blue-100 bg-white p-6 shadow-xl shadow-blue-100/60">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
            Prototype impact
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">
            Built to close the awareness gap.
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Many people miss credits because the system assumes they already
            know the forms, lines, and benefit names. TaxBridge starts with
            life situations instead.
          </p>
          <div className="mt-6">
            <CounterDisplay />
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
              Why it helps
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
              TaxBridge turns uncertainty into next steps.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {barriers.map((barrier) => (
              <div
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                key={barrier}
              >
                <p className="font-semibold leading-7 text-slate-800">
                  {barrier}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
