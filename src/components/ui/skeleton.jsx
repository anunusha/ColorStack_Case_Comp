import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[color-mix(in_oklab,var(--palette-granite)_14%,var(--palette-platinum))]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

