import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
}) {
  return (
    <Card className="border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {description ? (
          <p className="leading-7 text-[var(--color-muted-foreground)]">{description}</p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          {primaryAction ? (
            <Button asChild>
              <Link href={primaryAction.href}>{primaryAction.label}</Link>
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button asChild variant="outline">
              <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
