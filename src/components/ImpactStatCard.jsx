import { Card, CardContent } from "@/components/ui/card";

export default function ImpactStatCard({ label, value }) {
  return (
    <Card className="bg-[var(--palette-white)]">
      <CardContent className="flex min-h-28 flex-col justify-between gap-3 px-7 py-6">
        <p className="text-2xl font-bold leading-none text-[var(--palette-black)]">
          {value}
        </p>
        <p className="text-caption font-medium leading-relaxed text-[var(--color-muted-foreground)]">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}

