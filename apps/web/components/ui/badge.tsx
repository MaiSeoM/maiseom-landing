import { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-brand/40 bg-brand/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand-foreground",
        className
      )}
      {...props}
    />
  );
}
