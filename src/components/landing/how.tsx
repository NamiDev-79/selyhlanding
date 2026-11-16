import type { ReactNode } from "react";

import { how } from "@/content/landing";
import { cn } from "@/lib/utils";

import { CalibrationVisual, LoadChart, PauseKinds } from "./how-visuals";
import { Reveal, RevealGroup, RevealItem } from "./reveal";
import { SectionHead } from "./ui";

function Row({ id, title, body, visual, flip = false }: { id?: string; title: string; body: string; visual: ReactNode; flip?: boolean }) {
  return (
    <div id={id} className={cn("l-golden items-center", flip ? "lg:grid-cols-[1.618fr_1fr]" : "lg:grid-cols-[1fr_1.618fr]")}>
      <RevealGroup className={cn("grid gap-[var(--s3)]", flip && "lg:order-2")}>
        <RevealItem>
          <h3 className="l-h2 text-[clamp(1.75rem,1.2rem+1.8vw,2.625rem)]!">{title}</h3>
        </RevealItem>
        <RevealItem as="p" className="l-lead text-muted-foreground">
          {body}
        </RevealItem>
      </RevealGroup>
      <Reveal x={flip ? -42 : 42} y={16} scale={0.97} duration={0.82} delay={0.1} className={cn(flip && "lg:order-1")}>
        {visual}
      </Reveal>
    </div>
  );
}

/** Notar, entender y pausar: lo que hace Selyh, cada parte con algo que se puede tocar. */
export function How() {
  return (
    <section aria-labelledby="como-title" className="l-section">
      <div className="l-wrap">
        <SectionHead id="como-title" title={how.title} lead={how.lead} />
        <div className="mt-[var(--s6)] grid gap-[clamp(68px,9vw,110px)]">
          <Row title={how.notice.title} body={how.notice.body} visual={<CalibrationVisual />} />
          <Row title={how.understand.title} body={how.understand.body} visual={<LoadChart />} flip />
          <Row id="pausa" title={how.pause.title} body={how.pause.body} visual={<PauseKinds />} />
        </div>
      </div>
    </section>
  );
}
