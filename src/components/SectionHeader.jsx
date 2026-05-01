import { cn } from "@/lib/utils";

export default function SectionHeader({
  badge,
  title,
  description,
  className,
  actions,
}) {
  return (
    <div className={cn("grid gap-4", className)}>
      <div className="grid gap-3">
        {badge}
        <h1 className="text-display text-[var(--color-foreground)]">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-body-lg text-[var(--color-muted-foreground)]">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
