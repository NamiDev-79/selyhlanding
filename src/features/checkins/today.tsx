"use client";

import { ArrowRight, Check, Clock, ListChecks, Moon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Skeleton } from "@/components/ui/feedback";
import { todayCopy } from "@/content/panel";
import { cn } from "@/lib/utils";

import { useNextPrompt } from "./hooks";

type Item = { icon: ReactNode; text: ReactNode; done?: boolean; href?: string };

/** Qué toca hoy según GET /prompts/next, como una lista corta de pendientes con su estado. */
export function TodayPrompt() {
  const q = useNextPrompt();
  const c = todayCopy;
  if (q.isPending) return <Skeleton className="h-full min-h-[220px] rounded-[16px]" />;
  if (q.isError) return null;
  const p = q.data;

  const items: Item[] = [];
  if (p.quiet) items.push({ icon: <Moon className="size-4" aria-hidden />, text: c.quiet, done: true });
  else {
    const due = p.checkIn.due;
    items.push({
      icon: due ? <span className="size-2 rounded-full bg-[#6363f1]" /> : <Check className="size-4" aria-hidden />,
      text: due ? c.checkinDue : c.checkinDone(p.checkIn.doneToday, p.checkIn.target),
      done: !due,
    });
    if (p.scale) {
      items.push({
        icon: <ListChecks className="size-4" aria-hidden />,
        text: p.scale.reason === "IN_PROGRESS" ? c.scaleInProgress(p.scale.name, p.scale.answered, p.scale.total) : c.scaleDue(p.scale.name),
        href: `/panel/escalas?code=${p.scale.code}`,
      });
    }
  }

  return (
    <section aria-labelledby="hoy" className="p-card flex h-full flex-col gap-4 p-[clamp(18px,2.6vw,26px)]">
      <h2 id="hoy" className="p-h2">
        {c.title}
      </h2>
      <ul className="grid gap-2">
        {items.map((it, i) => {
          const body = (
            <>
              <span className={cn("grid size-8 shrink-0 place-items-center rounded-full", it.done ? "bg-brand-tint text-brand-strong" : "bg-brand-tint text-brand")}>{it.icon}</span>
              <span className={cn("flex-1 text-[15px] leading-snug", it.done && "text-muted-foreground")}>{it.text}</span>
              {it.href ? <ArrowRight className="size-4 shrink-0 text-brand transition-transform group-hover:translate-x-0.5" aria-hidden /> : null}
            </>
          );
          return (
            <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}>
              {it.href ? (
                <Link href={it.href} className="group flex items-center gap-3 rounded-[10px] border border-[var(--app-edge)] p-3 transition-colors hover:border-[#a2a2fa] hover:bg-brand-tint/50">
                  {body}
                </Link>
              ) : (
                <div className="flex items-center gap-3 p-3">{body}</div>
              )}
            </motion.li>
          );
        })}
      </ul>
      {p.bestHours.length ? (
        <p className="mt-auto flex items-center gap-2 border-t border-[var(--app-edge)] pt-3 text-[13px] text-muted-foreground">
          <Clock className="size-4 text-brand" aria-hidden />
          {c.bestHours} <span className="tabular-nums text-foreground">{p.bestHours.map((h) => `${String(h).padStart(2, "0")}:00`).join(" · ")}</span>
        </p>
      ) : null}
    </section>
  );
}
