"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/shadcn/button";
import { Input, Textarea } from "@/components/ui/field";
import { contact } from "@/content/landing";
import { api, errorText, unwrap } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { Reveal, RevealGroup, RevealItem, RevealWords } from "./reveal";

type Kind = keyof typeof contact.tabs;
const KINDS = Object.keys(contact.tabs) as Kind[];

const schema = z.object({
  email: z.email("Escribe un correo válido").max(254),
  name: z.string().trim().min(1, "Escribe tu nombre").max(100),
  company: z.string().trim().max(120).optional(),
  message: z.string().trim().max(2000).optional(),
  website: z.string().max(200).optional(), // campo trampa para bots
});
type Values = z.infer<typeof schema>;

/** Demo para empresas o consulta general (POST /public/leads). */
function ContactForm() {
  const [kind, setKind] = useState<Kind>("DEMO");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<Values>({ resolver: zodResolver(schema) });

  const submit = form.handleSubmit(async (v) => {
    setError(null);
    try {
      await unwrap(
        api.POST("/public/leads", {
          body: { kind, email: v.email, name: v.name, company: v.company || undefined, message: v.message || undefined, website: v.website || undefined },
        }),
      );
      setSent(true);
      form.reset();
    } catch (e) {
      setError(errorText(e));
    }
  });

  if (sent) {
    return (
      <div role="status" className="l-pop grid min-h-[360px] place-items-center rounded-[16px] border border-hairline bg-surface p-[var(--s5)] text-center">
        <div className="grid justify-items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full bg-brand-tint">
            <Check className="size-6 text-brand-strong" aria-hidden />
          </span>
          <p className="font-display text-[26px] font-semibold">{contact.success.title}</p>
          <p className="max-w-[36ch] text-muted-foreground">{contact.success.body}</p>
          <button type="button" onClick={() => setSent(false)} className="mt-2 text-[15px] font-medium text-brand-strong underline underline-offset-4">
            Enviar otro mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="l-elev-2 rounded-[16px] border border-hairline bg-surface p-[var(--s4)] sm:p-[var(--s5)]">
      <div role="tablist" aria-label="Tipo de mensaje" className="flex w-full gap-1 rounded-full bg-surface-raised p-1 sm:w-fit">
        {KINDS.map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={kind === k}
            aria-controls="contacto-form"
            onClick={() => setKind(k)}
            className={cn("h-10 flex-1 rounded-full px-4 text-[14px] transition-colors sm:flex-none", kind === k ? "l-elev-1 bg-surface font-medium text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            {contact.tabs[k].label}
          </button>
        ))}
      </div>

      <form id="contacto-form" role="tabpanel" onSubmit={submit} noValidate className="mt-[var(--s4)] grid gap-[var(--s3)]">
        <div className="grid gap-[var(--s3)] sm:grid-cols-2">
          <Input label="Nombre" autoComplete="name" error={form.formState.errors.name?.message} {...form.register("name")} />
          <Input label="Correo de trabajo" type="email" autoComplete="email" error={form.formState.errors.email?.message} {...form.register("email")} />
        </div>
        {kind === "DEMO" ? <Input label="Empresa" autoComplete="organization" {...form.register("company")} /> : null}
        <Textarea
          label={kind === "DEMO" ? "Cuéntanos sobre tu equipo (opcional)" : "Mensaje"}
          hint={kind === "DEMO" ? "Cuántas personas son, si hacen guardias, qué les preocupa." : undefined}
          {...form.register("message")}
        />
        <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...form.register("website")} />
        {error ? (
          <p role="alert" className="rounded-[10px] bg-brand-tint px-4 py-3 text-[15px] text-foreground">
            {error}
          </p>
        ) : null}
        <Button type="submit" size="lg" disabled={form.formState.isSubmitting} className="w-full sm:w-fit">
          {form.formState.isSubmitting ? "Enviando…" : contact.tabs[kind].submit} <ArrowRight aria-hidden />
        </Button>
      </form>
    </div>
  );
}

export function Contact() {
  return (
    <section id="contacto" aria-labelledby="contacto-title" className="l-section bg-surface-raised">
      <div className="l-wrap l-golden items-start lg:grid-cols-[1fr_1.618fr]!">
        <div className="grid gap-[var(--s4)]">
          <h2 id="contacto-title" className="l-h2">
            <RevealWords text={contact.title.lead} accent={contact.title.accent} accentClassName="l-accent text-brand-strong" />
          </h2>
          <Reveal as="p" delay={0.25} className="l-lead text-muted-foreground">
            {contact.lead}
          </Reveal>
          <RevealGroup as="ul" stagger={0.08} delay={0.35} className="grid gap-2.5">
            {contact.facts.map((f) => (
              <RevealItem as="li" key={f} className="flex items-center gap-2.5">
                <Check className="size-4 text-brand" aria-hidden />
                {f}
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
        <Reveal y={42} delay={0.15} duration={0.82}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
