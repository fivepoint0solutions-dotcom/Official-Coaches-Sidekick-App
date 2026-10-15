import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-sans text-sm font-semibold tracking-[0.01em] cursor-pointer transition-refined focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-subtle hover:bg-primary/90",
        /** Primary CTA — Hockey Stick Angle: angular beveled dark blue + cyan glow edge. */
        cta: "btn-hockey btn-stick",
        /** Hockey Stick Angle — primary actions (Save play, Build my practice). */
        stick: "btn-hockey btn-stick",
        /** Ice Rink Silhouette — white pill, dark blue border, faint rink markings. Light secondary actions (Print, Save as PDF). */
        rink: "btn-hockey btn-rink",
        /** Puck / Faceoff Circle — black rounded block, blue outline, faceoff dot. Strong dark actions (Send). */
        puck: "btn-hockey btn-puck",
        /** Skate Blade Edge — metallic silver-blue pointed hexagon. Confirm / finalize actions (Confirm, Save). */
        blade: "btn-hockey btn-blade",
        /** Confirm / finalize CTA — Skate Blade Edge. */
        hero: "btn-hockey btn-blade",
        /** Warm secondary — coral. */
        coral: "bg-accent text-accent-foreground shadow-subtle hover:bg-accent/90",
        /** Natural highlight — teal, used sparingly. */
        teal: "bg-highlight text-highlight-foreground shadow-subtle hover:bg-highlight/90",
        /** Mode primaries — all four modes use the Hockey Stick Angle primary. */
        inspire: "btn-hockey btn-stick",
        build: "btn-hockey btn-stick",
        busywork: "btn-hockey btn-stick",
        challenge: "btn-hockey btn-stick",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        /** Light secondary — Ice Rink Silhouette. */
        outline: "btn-hockey btn-rink",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "bg-transparent hover:bg-secondary hover:text-secondary-foreground",
        link: "h-auto p-0 link-underline font-normal",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-9 text-[0.9375rem]",
        xl: "h-16 px-11 text-base rounded-2xl",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
