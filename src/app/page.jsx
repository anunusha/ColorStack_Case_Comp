export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-4 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
        TaxBridge setup complete
      </p>
      <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
        Find the tax credits you might be missing.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        Phase 0 is ready: Next.js, Tailwind, linting, and shared dependencies
        are installed. Frontend pages come next.
      </p>
    </main>
  );
}
