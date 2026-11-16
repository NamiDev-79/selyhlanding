"use client";

import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "motion/react";
import Link from "next/link";

import { LoadSummary } from "@/features/analytics/load-summary";
import { useMe } from "@/features/auth/hooks";
import { QuickCheckin } from "@/features/checkins/quick-checkin";
import { TodayPrompt } from "@/features/checkins/today";
import { OpenCrisisFlags } from "@/features/crisis/crisis-resources";

function greeting(h: number) {
  return h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
}

const EASE = [0.22, 1, 0.36, 1] as const;
const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const item: Variants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } };

/** Pausa a un clic: las barras del logo respiran al ritmo de una respiración lenta (4 s). */
function PauseCard() {
  return (
    <Link
      href="/panel/intervenciones"
      className="p-card group relative flex h-full min-h-[220px] flex-col justify-between gap-6 overflow-hidden p-[clamp(18px,2.6vw,26px)] transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#a2a2fa]"
    >
      <div className="flex h-[92px] items-end gap-[14px]" aria-hidden>
        <motion.span
          className="block w-[34px] origin-bottom rounded-full bg-[#6363f1]"
          style={{ height: 92 }}
          animate={{ scaleY: [1, 0.86, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="block w-[34px] origin-bottom rounded-full bg-[#a2a2fa]"
          style={{ height: 57 }}
          animate={{ scaleY: [1, 1.18, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
      </div>
      <div className="grid gap-1">
        <h2 className="p-h2">¿Necesitas una pausa?</h2>
        <p className="text-[15px] text-muted-foreground">Ejercicios de 1 a 5 minutos para respirar, moverte o ordenar ideas.</p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-[15px] font-medium text-brand-strong">
          Elegir una pausa <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
        </span>
      </div>
    </Link>
  );
}

export default function PanelHome() {
  const me = useMe();
  const now = new Date();
  const first = me.data?.name.split(" ")[0];
  return (
    <motion.div variants={list} initial="hidden" animate="show" className="grid gap-[clamp(16px,2vw,20px)]">
      <motion.header variants={item} className="mb-[clamp(6px,1.5vw,22px)] grid gap-1.5">
        <p className="text-[14px] font-medium text-brand-strong first-letter:uppercase">{now.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" })}</p>
        <h1 className="p-title">
          {greeting(now.getHours())}
          {first ? (
            <>
              , <span className="l-accent text-brand">{first}</span>
            </>
          ) : null}
        </h1>
      </motion.header>

      <OpenCrisisFlags />

      {/* Lo de hoy: el check-in manda (61,8 %) y al lado lo pendiente (38,2 %) */}
      <div className="grid gap-[clamp(16px,2vw,20px)] lg:grid-cols-[1.618fr_1fr]">
        <motion.div variants={item}>
          <QuickCheckin />
        </motion.div>
        <motion.div variants={item}>
          <TodayPrompt />
        </motion.div>
      </div>

      <div className="grid gap-[clamp(16px,2vw,20px)] lg:grid-cols-[1.618fr_1fr]">
        <motion.div variants={item}>
          <LoadSummary />
        </motion.div>
        <motion.div variants={item}>
          <PauseCard />
        </motion.div>
      </div>
    </motion.div>
  );
}
