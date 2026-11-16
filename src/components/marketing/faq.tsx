"use client";

import * as Accordion from "@radix-ui/react-accordion";

import { Icon } from "@/components/ui/icons";
import { faq } from "@/content/faq";

export function FaqList() {
  return (
    <Accordion.Root type="single" collapsible defaultValue="q0" className="grid gap-3">
      {faq.items.map((item, i) => (
        <Accordion.Item
          key={item.q}
          value={`q${i}`}
          className="rounded-2xl border border-line bg-paper transition-shadow data-[state=open]:shadow-card"
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 px-5 py-4 text-left text-step-0 font-semibold hover:text-accent-strong sm:px-6 sm:py-5">
              {item.q}
              <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-paper-2 text-ink-soft transition-[transform,background-color,color] duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-accent group-data-[state=open]:text-on-accent">
                <Icon name="plus" className="size-4" />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:hidden">
            <p className="max-w-[64ch] px-5 pb-5 text-ink-soft sm:px-6">{item.a}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
