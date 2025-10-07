import { Label as RadixLabel, LabelProps as RadixLabelProps } from "@radix-ui/react-label";
import { cn } from "../../lib/utils";

export type LabelProps = RadixLabelProps;

export function Label({ className, ...props }: LabelProps) {
  return <RadixLabel className={cn("text-sm font-medium text-slate-200", className)} {...props} />;
}
