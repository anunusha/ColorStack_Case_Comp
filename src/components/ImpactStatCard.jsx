import { Card, CardContent } from "@/components/ui/card";

export default function ImpactStatCard({ label, value }) {
  return (
    <Card className="bg-[var(--color-surface-subtle)] text-[var(--color-surface-subtle-foreground)]">
      <CardContent className="grid gap-1 p-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm font-medium text-[var(--color-muted-foreground)]">
          {label}
        </p>
      </CardContent>
    </Card>
  );
}

