import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function QuestionCard({ questionText, helperText, action }) {
  return (
    <Card className="bg-[var(--palette-white)]">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <Badge className="w-fit" variant="secondary">
            TaxBridge asks
          </Badge>
          {action}
        </div>
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

