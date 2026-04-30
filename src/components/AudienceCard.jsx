import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AudienceCard({ href, eyebrow, title, description }) {
  return (
    <Link className="group block" href={href}>
      <Card className="h-full transition group-hover:-translate-y-1 group-hover:shadow-md">
        <CardHeader className="gap-3">
          {eyebrow ? (
            <Badge className="w-fit" variant="secondary">
              {eyebrow}
            </Badge>
          ) : null}
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm leading-6 text-slate-600">{description}</p>
          <p className="text-sm font-semibold text-slate-900">
            Start intake <span aria-hidden="true">-&gt;</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

