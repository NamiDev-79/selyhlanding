import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Botón (shadcn/ui) con las reglas del sistema de diseño Selyh:
 * un `default` (primario) por vista, 44 px de alto mínimo en tamaño `lg`,
 * hover con brightness(.9) (brand-strong no pasa contraste en oscuro) y foco índigo de 2 px.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-[filter,background-color,color,border-color,transform] duration-200 ease-[cubic-bezier(.22,1,.36,1)] active:translate-y-px disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:brightness-90",
        outline: "border border-input bg-background text-foreground hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground hover:bg-brand-tint",
        ghost: "text-foreground hover:bg-muted",
        link: "rounded-none px-0! text-brand-strong underline decoration-1 underline-offset-4 decoration-brand-soft hover:decoration-current",
        inverse: "bg-white text-[#0f1523] hover:brightness-95",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        default: "h-10 px-5 text-[0.95rem]",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
