"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Section } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/feedback";
import { Input, Select } from "@/components/ui/field";
import { api, errorText, unwrap } from "@/lib/api/client";
import { type Me, meKey } from "@/features/auth/hooks";
import { EmailVerification } from "@/features/onboarding/email-verification";

const ZONES = ["America/Lima", "America/Bogota", "America/Mexico_City", "America/Santiago", "America/Argentina/Buenos_Aires", "America/New_York", "Europe/Madrid", "UTC"];

function Profile({ me }: { me: Me }) {
  const qc = useQueryClient();
  const [name, setName] = useState(me.name);
  const [timezone, setTimezone] = useState(me.timezone);
  const save = useMutation({
    mutationFn: () => unwrap(api.PATCH("/users/me", { body: { name: name.trim(), timezone } })),
    onSuccess: (data) => qc.setQueryData(meKey, data),
  });
  const zones = ZONES.includes(me.timezone) ? ZONES : [me.timezone, ...ZONES];
  return (
    <form
      className="grid max-w-lg gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      <Select label="Zona horaria" hint="Define qué es “hoy” para tus check-ins y horas de silencio." value={timezone} onChange={(e) => setTimezone(e.target.value)}>
        {zones.map((z) => (
          <option key={z} value={z}>
            {z.replace(/_/g, " ")}
          </option>
        ))}
      </Select>
      <div className="flex items-center gap-3">
        <Button type="submit" variant="secondary" pending={save.isPending} disabled={!name.trim()}>
          Guardar
        </Button>
        {save.isSuccess ? <span role="status" className="text-step--1 text-accent-strong">Guardado.</span> : null}
        {save.isError ? <span role="alert" className="text-step--1 text-warm-ink">{errorText(save.error)}</span> : null}
      </div>
    </form>
  );
}

function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const change = useMutation({
    mutationFn: () => unwrap(api.POST("/auth/password", { body: { currentPassword: current, newPassword: next } })),
    onSuccess: () => {
      setCurrent("");
      setNext("");
    },
  });
  return (
    <form
      className="grid max-w-lg gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        change.mutate();
      }}
    >
      <Input label="Contraseña actual" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
      <Input label="Contraseña nueva" type="password" autoComplete="new-password" hint="Mínimo 10 caracteres. Cierra las demás sesiones abiertas." value={next} onChange={(e) => setNext(e.target.value)} />
      {change.isSuccess ? <Notice tone="calm" role="status" title="Contraseña actualizada." /> : null}
      {change.isError ? <Notice tone="attention" role="alert" title={errorText(change.error)} /> : null}
      <div>
        <Button type="submit" variant="secondary" pending={change.isPending} disabled={!current || next.length < 10}>
          Cambiar contraseña
        </Button>
      </div>
    </form>
  );
}

export function AccountCenter({ me }: { me: Me }) {
  return (
    <div className="grid gap-16">
      <Section title="Correo">
        <EmailVerification me={me} />
      </Section>
      <Section title="Perfil">
        <Profile me={me} />
      </Section>
      <Section title="Contraseña">
        <ChangePassword />
      </Section>
    </div>
  );
}
