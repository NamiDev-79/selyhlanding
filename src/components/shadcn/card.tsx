import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Card (shadcn/ui): radio 16 (`radius-lg`) y relleno de 26 (`space-4`) del sistema Selyh. */
function Card({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card" className={cn("flex flex-col gap-6 rounded-2xl border border-border bg-card p-[26px] text-card-foreground", className)} {...props} />;
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("grid gap-1.5", className)} {...props} />;
}

function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("font-display text-xl font-bold leading-tight tracking-[-0.01em]", className)} {...props} />;
}

function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-[0.95rem] text-muted-foreground", className)} {...props} />;
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("grid gap-4", className)} {...props} />;
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("mt-auto flex items-center", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
