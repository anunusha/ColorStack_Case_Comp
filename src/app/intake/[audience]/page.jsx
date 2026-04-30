import Link from "next/link";
import { notFound } from "next/navigation";

const audienceLabels = {
  student: "Student",
  dtc: "Disability Tax Credit",
};

export default async function IntakePage({ params }) {
  const { audience } = await params;
  const audienceLabel = audienceLabels[audience];

  if (!audienceLabel) {
    notFound();
  }

  return (
    <main className="mx-auto flex min-h-full max-w-4xl flex-col px-6 py-16">
      <Link className="mb-8 text-sm font-semibold text-blue-700" href="/">
        Back to home
      </Link>
      <p className="mb-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 w-fit">
        Intake shell
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-slate-950">
        {audienceLabel} intake
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
        Phase 1 route is working. The question-by-question intake UI will be
        added in the next phase.
      </p>
      <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Placeholder question card
        </p>
        <p className="mt-3 text-2xl font-semibold text-slate-900">
          Your guided questions will appear here.
        </p>
      </div>
    </main>
  );
}
