import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-accent text-bg hover:bg-accent/90 shadow-lg shadow-accent/20",
        destructive: "bg-red text-white hover:bg-red/90",
        outline: "border border-border bg-transparent hover:bg-elevated hover:border-border-light text-text",
        secondary: "bg-elevated text-text hover:bg-border-light",
        ghost: "hover:bg-elevated text-dim hover:text-text",
        link: "text-accent underline-offset-4 hover:underline",
        green: "bg-green/10 text-green border border-green/20 hover:bg-green/20",
        red: "bg-red/10 text-red border border-red/20 hover:bg-red/20",
        amber: "bg-amber/10 text-amber border border-amber/20 hover:bg-amber/20",
      },
      size: { default: "h-9 px-4 py-2", sm: "h-8 rounded-md px-3 text-xs", lg: "h-10 rounded-lg px-6", icon: "h-8 w-8" },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";
export { Button, buttonVariants };
