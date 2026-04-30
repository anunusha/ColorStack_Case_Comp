import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuestionCard({ questionText, helperText }) {
  return (
    <Card className="bg-[var(--color-surface-subtle)] text-[var(--color-surface-subtle-foreground)]">
      <CardHeader className="gap-3">
        <Badge className="w-fit" variant="secondary">
          TaxBridge asks
        </Badge>
        <CardTitle className="text-3xl leading-tight">{questionText}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="leading-7 text-[var(--color-muted-foreground)]">
          {helperText}
        </p>
      </CardContent>
    </Card>
  );
}

