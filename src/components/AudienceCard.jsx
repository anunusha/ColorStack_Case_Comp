import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AudienceCard({ href, eyebrow, title, description }) {
  return (
    <Link className="group block" href={href}>
      <Card className="h-full border-[var(--color-border)] bg-[var(--color-card)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]">
        <CardHeader className="gap-3">
          {eyebrow ? (
            <Badge className="w-fit" variant="secondary">
              {eyebrow}
            </Badge>
          ) : null}
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">{description}</p>
          <p className="text-sm font-semibold text-[var(--color-primary)]">
            Start intake <span aria-hidden="true">→</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
