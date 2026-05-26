import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-elevated text-dim border border-border",
        accent: "bg-accent-dim text-accent border border-accent/20",
        green: "bg-green-dim text-green border border-green/20",
        red: "bg-red-dim text-red border border-red/20",
        amber: "bg-amber-dim text-amber border border-amber/20",
        purple: "bg-purple/10 text-purple border border-purple/20",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
