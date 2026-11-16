import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Badge (shadcn/ui) con los tonos del sistema Selyh: neutral, brand, solid, inverse. */
const badgeVariants = cva("inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.8125rem] font-medium leading-none", {
  variants: {
    tone: {
      neutral: "border border-border bg-background text-muted-foreground",
      brand: "bg-brand-tint text-brand-strong",
      solid: "bg-primary text-primary-foreground",
      inverse: "bg-[#0f1523] text-white",
    },
  },
  defaultVariants: { tone: "neutral" },
});

function Badge({ className, tone, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { Badge, badgeVariants };
