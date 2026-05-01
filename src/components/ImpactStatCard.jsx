import { Card, CardContent } from "@/components/ui/card";

export default function ImpactStatCard({ label, value }) {
  return (
    <Card className="min-w-0 bg-[var(--palette-white)]">
      <CardContent className="flex min-h-28 min-w-0 flex-col justify-between gap-3 px-4 py-6">
        <p className="min-w-0 [overflow-wrap:anywhere] text-[clamp(1.1rem,1.6vw,1.5rem)] font-bold leading-tight tracking-tight text-[var(--palette-black)]">
          {value}
        </p>
        <p className="text-caption font-medium leading-relaxed text-[var(--color-muted-foreground)]">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}

