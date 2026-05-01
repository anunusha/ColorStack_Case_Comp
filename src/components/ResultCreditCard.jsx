import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ResultCreditCard({ credit, formattedDollars }) {
  const explanation =
    credit.plain_english_explanation ?? credit.fallback_explanation;

  return (
    <Card className="border-[var(--color-border)] shadow-[var(--shadow-card)]">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="grid gap-2">
            <Badge className="w-fit" variant="secondary">
              Likely match
            </Badge>
            <CardTitle className="text-2xl">{credit.name}</CardTitle>
          </div>
          <Badge className="w-fit text-base" variant="outline">
            {formattedDollars}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        <p className="leading-7 text-[var(--color-muted-foreground)]">
          {explanation}
        </p>
        {credit.computed_estimate?.disclaimer ? (
          <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
            {credit.computed_estimate.disclaimer}
          </p>
        ) : null}
        <Separator />
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-[var(--palette-white)]">
            <CardHeader>
              <CardTitle className="text-lg">Documents to gather</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm leading-6 text-[var(--color-muted-foreground)]">
                {credit.documents_needed.map((document) => (
                  <li key={document}>- {document}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-[var(--palette-white)]">
            <CardHeader>
              <CardTitle className="text-lg">Where it goes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-[var(--color-muted-foreground)]">
                {credit.filing_destination}
              </p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

