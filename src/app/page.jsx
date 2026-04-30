import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-full max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
        Landing page shell
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
        Find the tax credits you might be missing.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        TaxBridge asks plain-English questions, identifies likely credits, and
        turns the next steps into a checklist.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          className="rounded-full bg-blue-700 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800"
          href="/intake/student"
        >
          I&apos;m a student
        </Link>
        <Link
          className="rounded-full border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
          href="/intake/dtc"
        >
          I&apos;m exploring the DTC
        </Link>
      </div>
    </main>
  );
}
