/** Textos del panel corporativo. */
export const companyNav = [
  { href: "/empresa", label: "Resumen", icon: "home", group: "main" },
  { href: "/empresa/equipos", label: "Equipos", icon: "users", group: "main" },
  { href: "/empresa/miembros", label: "Miembros", icon: "mail", group: "main" },
  { href: "/empresa/ajustes", label: "Ajustes", icon: "sliders", group: "account" },
  { href: "/empresa/auditoria", label: "Auditoría", icon: "shield", group: "account" },
  { href: "/empresa/plan", label: "Plan y facturación", icon: "card", group: "account" },
] as const;

export const metricCopy: Record<string, { label: string; describe: (v: number) => string }> = {
  stress_zscore: {
    label: "Carga media frente a su línea base",
    describe: (v) => (v >= 1 ? "Alta de forma sostenida" : v >= 0.5 ? "En aumento" : v <= -0.5 ? "Por debajo de lo habitual" : "Estable"),
  },
  checkin_score: { label: "Check-in medio (1 a 5)", describe: (v) => (v >= 4 ? "Se sienten cargados" : v >= 3 ? "Normal" : "Tranquilos") },
  high_load_share: { label: "Personas con carga alta", describe: (v) => `${Math.round(v * 100)}% del equipo` },
};

export const companyCopy = {
  privacyNote: (k: number) =>
    `Solo ves promedios de equipos con al menos ${k} personas por métrica. No existe una vista por persona, y cada vez que abres esta información queda en el registro de auditoría.`,
  noData: (k: number) => `Sin datos todavía. El equipo necesita al menos ${k} personas con check-ins activos para mostrar tendencias.`,
  causes: "Si una tendencia sube, mira las causas del equipo: guardias, reuniones, deuda técnica, plazos. Nunca a las personas.",
  inviteStatus: { PENDING: "Pendiente", ACCEPTED: "Aceptada", REVOKED: "Revocada", EXPIRED: "Vencida" } as Record<string, string>,
  roles: { ADMIN: "Administración", MEMBER: "Integrante" } as Record<string, string>,
  audit: {
    CREATE_TEAM: "Creó un equipo",
    ADD_MEMBER: "Agregó a un miembro",
    ADD_TO_TEAM: "Asignó a un equipo",
    LIST_MEMBERS: "Vio la lista de miembros",
    VIEW_TEAM_METRICS: "Vio las tendencias de un equipo",
    REFRESH_TEAM_AGGREGATE: "Recalculó un agregado",
    VIEW_AUDIT_LOG: "Vio el registro de auditoría",
    UPDATE_MIN_AGGREGATION: "Cambió el mínimo de agregación",
    INVITE_MEMBER: "Envió una invitación",
    REVOKE_INVITE: "Revocó una invitación",
    ACCEPT_INVITE: "Se aceptó una invitación",
    UPDATE_SEATS: "Cambió los puestos contratados",
  } as Record<string, string>,
};
