export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-5 text-sm text-slate-600">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-slate-800">TaxBridge</p>
        <p className="max-w-3xl">
          TaxBridge is an educational prototype, not tax, legal, or financial
          advice. It helps identify credits you may want to review before
          filing.
        </p>
      </div>
    </footer>
  );
}
