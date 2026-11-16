"use client";

import { Check, Mail, UsersRound } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { Section } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge, Empty, Loading, Notice } from "@/components/ui/feedback";
import { Input, Select } from "@/components/ui/field";
import { companyCopy } from "@/content/company";
import { api, errorText, unwrap } from "@/lib/api/client";
import { SimulatedNotice } from "@/features/onboarding/plan-picker";
import { usePlans } from "@/features/onboarding/hooks";

import { useAudit, useCompany, useCompanyMutation, useInvites, useMembers, useSeats, useTeams } from "./hooks";

const fmt = (iso: string) => new Date(iso).toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" });

// ───────────────────────────── Equipos ─────────────────────────────

export function TeamsManager() {
  const { companyId } = useCompany();
  const teams = useTeams(companyId);
  const members = useMembers(companyId);
  const [name, setName] = useState("");
  const [assign, setAssign] = useState<Record<string, string>>({});
  const [assigned, setAssigned] = useState<string | null>(null);
  const create = useCompanyMutation(companyId, (n: string) => unwrap(api.POST("/companies/{companyId}/teams", { params: { path: { companyId } }, body: { name: n } })));
  const add = useCompanyMutation(companyId, ({ teamId, userId }: { teamId: string; userId: string }) =>
    unwrap(api.POST("/companies/{companyId}/teams/{teamId}/members", { params: { path: { companyId, teamId } }, body: { userId } })),
  );

  return (
    <div className="grid gap-5">
      <Section title="Nuevo equipo" description="Agrupa como trabajan de verdad: por producto, guardia o área.">
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate(name.trim(), { onSuccess: () => setName("") });
          }}
        >
          <Input label="Nombre del equipo" value={name} onChange={(e) => setName(e.target.value)} className="w-72" />
          <Button type="submit" disabled={name.trim().length < 2} pending={create.isPending}>
            Crear equipo
          </Button>
        </form>
        {create.isError ? <Notice tone="attention" title={errorText(create.error)} /> : null}
      </Section>

      <Section title="Equipos" description={`Recuerda: con menos de 5 personas un equipo no mostrará tendencias.`}>
        {teams.isPending ? <Loading /> : null}
        {teams.data && !teams.data.length ? <Empty title="Aún no hay equipos">Crea el primero arriba.</Empty> : null}
        <ul className="grid gap-3">
          {teams.data?.map((t, i) => (
            <motion.li
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="grid gap-4 rounded-[16px] border border-[var(--app-edge)] p-4 sm:grid-cols-[1fr_auto] sm:items-end"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-[10px] bg-brand-tint text-brand">
                  <UsersRound className="size-5" aria-hidden />
                </span>
                <div className="grid gap-0.5">
                  <span className="font-display text-[18px] font-semibold leading-tight">{t.name}</span>
                  <span className="text-[12px] text-muted-foreground">Creado el {fmt(t.createdAt)}</span>
                </div>
              </div>
              <form
                className="flex flex-wrap items-end gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const userId = assign[t.id];
                  if (userId)
                    add.mutate(
                      { teamId: t.id, userId },
                      {
                        onSuccess: () => {
                          setAssigned(t.id);
                          setAssign({ ...assign, [t.id]: "" });
                        },
                      },
                    );
                }}
              >
                <Select label="Asignar persona" value={assign[t.id] ?? ""} onChange={(e) => setAssign({ ...assign, [t.id]: e.target.value })} className="w-60">
                  <option value="">Elegir…</option>
                  {members.data?.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.name ?? m.email}
                    </option>
                  ))}
                </Select>
                <Button type="submit" variant="secondary" disabled={!assign[t.id]} pending={add.isPending && add.variables?.teamId === t.id}>
                  Asignar
                </Button>
              </form>
              {assigned === t.id && add.isSuccess ? (
                <p className="flex items-center gap-1.5 text-[14px] text-brand-strong sm:col-span-2">
                  <Check className="size-4" aria-hidden /> Asignado.
                </p>
              ) : null}
            </motion.li>
          ))}
        </ul>
        {add.isError ? <Notice tone="attention" title={errorText(add.error)} /> : null}
      </Section>
    </div>
  );
}

// ───────────────────────────── Miembros e invitaciones ─────────────────────────────

function SeatMeter() {
  const { companyId } = useCompany();
  const seats = useSeats(companyId);
  if (!seats.data) return null;
  const { used, seats: total } = seats.data;
  const pct = total ? Math.min(100, (used / total) * 100) : 0;
  return (
    <div className="grid max-w-md gap-3">
      <p className="flex items-baseline gap-2">
        <span className="font-display text-[clamp(2.25rem,1.8rem+1.4vw,3rem)] font-bold leading-none tracking-[-0.04em] tabular-nums">{used}</span>
        <span className="text-muted-foreground">de {total ?? "—"} puestos en uso</span>
      </p>
      <div className="h-2.5 overflow-hidden rounded-full bg-brand-tint" role="progressbar" aria-valuenow={used} aria-valuemin={0} aria-valuemax={total ?? used} aria-label="Puestos usados">
        <motion.div className="h-full rounded-full bg-[#6363f1]" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      {pct >= 100 ? <p className="text-[14px] text-muted-foreground">Usas todos tus puestos. Súmalos en Plan y facturación para invitar a más personas.</p> : null}
    </div>
  );
}

export function MembersManager() {
  const { companyId } = useCompany();
  const members = useMembers(companyId);
  const invites = useInvites(companyId);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"MEMBER" | "ADMIN">("MEMBER");
  const invite = useCompanyMutation(companyId, () => unwrap(api.POST("/companies/{companyId}/invites", { params: { path: { companyId } }, body: { email: email.trim(), role } })));
  const revoke = useCompanyMutation(companyId, (inviteId: string) => unwrap(api.DELETE("/companies/{companyId}/invites/{inviteId}", { params: { path: { companyId, inviteId } } })));

  return (
    <div className="grid gap-5">
      <Section title="Puestos">
        <SeatMeter />
      </Section>

      <Section title="Invitar por correo" description="Le llegará un enlace válido por unos días. Al aceptarlo ocupa un puesto.">
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            invite.mutate(undefined, { onSuccess: () => setEmail("") });
          }}
        >
          <Input label="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-72" />
          <Select label="Rol" value={role} onChange={(e) => setRole(e.target.value as "MEMBER" | "ADMIN")} className="w-44">
            <option value="MEMBER">Integrante</option>
            <option value="ADMIN">Administración</option>
          </Select>
          <Button type="submit" disabled={!email.includes("@")} pending={invite.isPending}>
            Enviar invitación
          </Button>
        </form>
        {invite.isSuccess ? <Notice tone="calm" role="status" title="Invitación enviada." /> : null}
        {invite.isError ? <Notice tone="attention" role="alert" title={errorText(invite.error)} /> : null}
      </Section>

      <Section title="Invitaciones">
        {invites.isPending ? <Loading /> : null}
        {invites.data && !invites.data.length ? <Empty title="Sin invitaciones">Las que envíes aparecerán aquí con su estado.</Empty> : null}
        <ul className="grid">
          {invites.data?.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--app-edge)] py-3 first:pt-0 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-tint text-brand">
                  <Mail className="size-4" aria-hidden />
                </span>
                <div className="grid gap-0.5">
                <span className="text-[15px]">{i.email}</span>
                <span className="text-[12px] text-muted-foreground">
                  {companyCopy.roles[i.role]} · vence {fmt(i.expiresAt)}
                </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone={i.status === "ACCEPTED" ? "calm" : i.status === "PENDING" ? "neutral" : "attention"}>{companyCopy.inviteStatus[i.status]}</Badge>
                {i.status === "PENDING" ? (
                  <Button size="sm" variant="ghost" pending={revoke.isPending && revoke.variables === i.id} onClick={() => revoke.mutate(i.id)}>
                    Revocar
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        {revoke.isError ? <Notice tone="attention" title={errorText(revoke.error)} /> : null}
      </Section>

      <Section title="Miembros" description="Solo datos de la organización: nunca de bienestar.">
        {members.isPending ? <Loading /> : null}
        <ul className="grid">
          {members.data?.map((m) => (
            <li key={m.userId} className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--app-edge)] py-3 first:pt-0 last:border-0 last:pb-0">
              <span className="flex min-w-0 items-center gap-3">
                <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-full bg-[#6363f1] text-[12px] font-semibold text-white">
                  {(m.name ?? m.email ?? "?")
                    .split(" ")
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase())
                    .join("")}
                </span>
                <span className="grid min-w-0">
                  <span className="truncate text-[15px] font-medium">{m.name}</span>
                  <span className="truncate text-[12px] text-muted-foreground">{m.email}</span>
                </span>
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-medium ${m.role === "ADMIN" ? "bg-[#6363f1] text-white" : "bg-brand-tint text-brand-strong"}`}>{companyCopy.roles[m.role]}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

// ───────────────────────────── Ajustes, plan y auditoría ─────────────────────────────

function SeatsForm() {
  const { companyId } = useCompany();
  const seats = useSeats(companyId);
  const plans = usePlans();
  const [value, setValue] = useState<number | null>(null);
  const update = useCompanyMutation(companyId, (n: number) => unwrap(api.PATCH("/companies/{companyId}/subscription", { params: { path: { companyId } }, body: { seats: n } })));
  if (!seats.data) return <Loading />;
  const current = value ?? seats.data.seats ?? 5;
  const price = plans.data?.find((p) => p.id === "CORPORATE")?.price.amount;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <Input label="Puestos contratados" type="number" min={Math.max(5, seats.data.used)} max={5000} value={current} onChange={(e) => setValue(Number(e.target.value))} className="w-44" hint={`En uso: ${seats.data.used}`} />
        <Button variant="secondary" disabled={current === seats.data.seats || current < 5} pending={update.isPending} onClick={() => update.mutate(current, { onSuccess: () => setValue(null) })}>
          Actualizar puestos
        </Button>
      </div>
      {price ? (
        <p className="text-ink-soft">
          {current} × ${price} = <span className="font-display text-[22px] font-bold text-ink tabular-nums">${current * price}</span> al mes (referencial)
        </p>
      ) : null}
      {update.isSuccess ? <Notice tone="calm" role="status" title="Puestos actualizados." /> : null}
      {update.isError ? <Notice tone="attention" role="alert" title={errorText(update.error)} /> : null}
    </div>
  );
}

export function CompanySettings() {
  const company = useCompany();
  const [k, setK] = useState(company.minAggregationSize ?? 5);
  const update = useCompanyMutation(company.companyId, (n: number) => unwrap(api.PATCH("/companies/{companyId}", { params: { path: { companyId: company.companyId } }, body: { minAggregationSize: n } })));

  return (
    <div className="grid gap-5">
      <Section
        title="Mínimo de agregación"
        description="Cuántas personas debe tener un equipo, por métrica, para mostrar su tendencia. Nunca menos de 5. Súbelo si tus equipos cambian mucho de integrantes: con grupos pequeños, sumar o quitar a alguien puede delatar su dato."
      >
        <div className="flex flex-wrap items-end gap-3">
          <Input label="Personas como mínimo" type="number" min={5} max={1000} value={k} onChange={(e) => setK(Number(e.target.value))} className="w-44" />
          <Button variant="secondary" disabled={k < 5 || k === company.minAggregationSize} pending={update.isPending} onClick={() => update.mutate(k)}>
            Guardar
          </Button>
        </div>
        {update.isSuccess ? <Notice tone="calm" role="status" title="Guardado. Se aplica en el próximo cálculo." /> : null}
        {update.isError ? <Notice tone="attention" role="alert" title={errorText(update.error)} /> : null}
      </Section>
      <Section title="Puestos">
        <SeatsForm />
      </Section>
    </div>
  );
}

export function CompanyBilling() {
  const { companyId, name } = useCompany();
  const seats = useSeats(companyId);
  return (
    <div className="grid gap-5">
      <Section title="Plan">
        <dl className="grid max-w-lg gap-3">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Empresa</dt>
            <dd className="font-medium">{name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Plan</dt>
            <dd>{seats.data?.plan === "TEAM_SEAT" ? "Corporativo" : (seats.data?.plan ?? "—")}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-soft">Puestos</dt>
            <dd className="figures">
              {seats.data ? `${seats.data.used} / ${seats.data.seats ?? "—"}` : "—"}
            </dd>
          </div>
        </dl>
      </Section>
      <Section title="Cambiar puestos">
        <SeatsForm />
      </Section>
      <Section title="Facturación">
        <SimulatedNotice />
      </Section>
    </div>
  );
}

export function AuditLog() {
  const { companyId } = useCompany();
  const audit = useAudit(companyId);
  const members = useMembers(companyId);
  if (audit.isPending) return <Loading />;
  if (audit.isError) return <Notice tone="attention" title={errorText(audit.error)} />;
  const who = new Map((members.data ?? []).map((m) => [m.userId, m.name ?? m.email ?? m.userId]));

  return (
    <div className="p-card overflow-hidden">
      <table className="w-full text-left text-[14px]">
        <thead className="bg-[var(--app-card-2)] text-[13px] text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium sm:px-5">Cuándo</th>
            <th className="px-4 py-3 font-medium max-sm:hidden">Quién</th>
            <th className="px-4 py-3 font-medium">Qué</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">Recurso</th>
          </tr>
        </thead>
        <tbody>
          {audit.data.map((row) => (
            <tr key={row.id} className="border-t border-[var(--app-edge)] align-baseline transition-colors hover:bg-[var(--app-card-2)]">
              <td className="whitespace-nowrap px-4 py-3 text-[13px] tabular-nums text-muted-foreground sm:px-5">{fmt(row.accessedAt)}</td>
              <td className="px-4 py-3 max-sm:hidden">{who.get(row.companyAdminUserId) ?? "Administración"}</td>
              <td className="px-4 py-3">{companyCopy.audit[row.action] ?? row.action}</td>
              <td className="hidden max-w-[22ch] truncate px-4 py-3 text-[12px] text-muted-foreground md:table-cell">{row.targetResource}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
