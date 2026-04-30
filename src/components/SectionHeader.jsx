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
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

