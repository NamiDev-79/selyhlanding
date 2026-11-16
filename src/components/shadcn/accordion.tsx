"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Accordion (shadcn/ui). El ícono + gira a × al abrir; la altura se anima con las variables de Radix. */
function Accordion(props: ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item data-slot="accordion-item" className={cn("border-b border-border", className)} {...props} />;
}

function AccordionTrigger({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group flex flex-1 items-start justify-between gap-6 py-5 text-left font-display text-lg font-semibold leading-snug tracking-[-0.01em] transition-colors hover:text-brand-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
          className,
        )}
        {...props}
      >
        {children}
        <Plus aria-hidden className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-data-[state=open]:rotate-45" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden data-[state=closed]:animate-[accordion-up_.25s_cubic-bezier(.22,1,.36,1)] data-[state=open]:animate-[accordion-down_.3s_cubic-bezier(.22,1,.36,1)]"
      {...props}
    >
      <div className={cn("max-w-[62ch] pb-6 pr-10 text-muted-foreground", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
