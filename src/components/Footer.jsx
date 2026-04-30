import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-white px-6 py-5 text-sm text-slate-600">
      <div className="mx-auto max-w-6xl">
        <Separator className="mb-5" />
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-slate-800">TaxBridge</p>
          <p className="max-w-3xl">
            TaxBridge is an educational prototype, not tax, legal, or financial
            advice. It helps identify credits you may want to review before
            filing.
          </p>
        </div>
      </div>
    </footer>
  );
}
