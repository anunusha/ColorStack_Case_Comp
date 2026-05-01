import { Card, CardContent } from "@/components/ui/card";

export default function ImpactStatCard({ label, value }) {
  return (
    <Card className="min-w-0 bg-[var(--palette-white)]">
      <CardContent className="flex min-h-32 min-w-0 flex-col justify-between gap-4 px-6 py-7">
        <p className="min-w-0 whitespace-nowrap text-[clamp(1.4rem,2.2vw,1.9rem)] font-bold leading-none tracking-tight text-[var(--palette-black)]">
          {value}
        </p>
        <p className="text-caption font-medium leading-relaxed text-[var(--color-muted-foreground)]">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}

