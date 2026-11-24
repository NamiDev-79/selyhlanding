/** Textos del panel personal. */
/**
 * Navegación del panel personal. «main» = lo de cada día (también en la barra inferior del móvil);
 * «account» = ajustes que se visitan de vez en cuando (en móvil, dentro de «Más»).
 */
export const panelNav = [
  { href: "/panel", label: "Inicio", icon: "home", group: "main" },
  { href: "/panel/historial", label: "Historial", icon: "chart", group: "main" },
  { href: "/panel/intervenciones", label: "Pausas", icon: "pause", group: "main" },
  { href: "/panel/escalas", label: "Escalas", icon: "list", group: "main" },
  { href: "/panel/preferencias", label: "Preferencias", icon: "sliders", group: "account" },
  { href: "/panel/privacidad", label: "Privacidad", icon: "shield", group: "account" },
  { href: "/panel/dispositivos", label: "Dispositivos", icon: "devices", group: "account" },
  { href: "/panel/extras", label: "Wearables y programas", icon: "watch", group: "account" },
  { href: "/panel/plan", label: "Plan", icon: "card", group: "account" },
  { href: "/panel/cuenta", label: "Cuenta", icon: "user", group: "account" },
] as const;

export const checkinCopy = {
  question: "¿Cómo llegas ahora?",
  scale: [
    { value: 1, label: "Muy tranquilo" },
    { value: 2, label: "Tranquilo" },
    { value: 3, label: "Normal" },
    { value: 4, label: "Cargado" },
    { value: 5, label: "Muy sobrecargado" },
  ],
  tagsLabel: "¿Algo en particular? (opcional)",
  tags: [
    { value: "meeting", label: "Reuniones" },
    { value: "bug", label: "Un bug" },
    { value: "deadline", label: "Deadline" },
    { value: "oncall", label: "Guardia" },
    { value: "review", label: "Revisión" },
    { value: "other", label: "Otra cosa" },
  ],
  saved: "Guardado. Gracias por tomarte un segundo.",
  consent: "Para guardar check-ins necesitas activar ese permiso. Solo se usa para calcular tu propia línea base.",
  consentAction: "Activar y guardar",
};

export const loadCopy = {
  title: "Tu carga",
  calibrating: "Calibrando",
  calibratingBody: (days: number, required: number) =>
    `Llevas ${days} de ${required} días con check-ins. Con ${required} días conoceremos tu ritmo habitual; hasta entonces no inventamos un número.`,
  noToday: "Aún no hay estimado de hoy. Aparece cuando registras un check-in.",
  trend: { STABLE: "Estable", RISING: "En aumento", HIGH: "Alta" } as Record<string, string>,
  confidence: "Confianza",
};

export const todayCopy = {
  title: "Para hoy",
  checkinDue: "Toca hacer un check-in.",
  checkinDone: (done: number, target: number) => `Check-ins de hoy: ${done} de ${target}.`,
  quiet: "Estás en tus horas de silencio. Nada que hacer por ahora.",
  scaleDue: (name: string) => `Hay una tanda corta de ${name} pendiente (3 preguntas).`,
  scaleInProgress: (name: string, a: number, t: number) => `Continúa ${name}: llevas ${a} de ${t}.`,
  bestHours: "Sueles registrar a las",
};

export const interventionCopy = {
  ask: "Pedir un ejercicio ahora",
  cap: (cap: number) => `Sugerimos como máximo ${cap} al día. Puedes cambiarlo en Preferencias.`,
  reasons: {
    OK: "",
    OPEN_CRISIS_FLAG: "Ahora lo importante es que hables con alguien. Estas líneas atienden personas, gratis.",
    DAILY_CAP_REACHED: "Ya llegaste al tope de sugerencias de hoy. Mañana habrá más.",
    PENDING_SUGGESTION: "Tienes una sugerencia sin responder. Respóndela primero.",
    NO_NEED: "Tu carga está estable. Si igual quieres una pausa, pídela.",
    NO_CONTENT_AVAILABLE: "No hay ejercicios nuevos disponibles ahora mismo.",
    QUIET_HOURS: "Estás en tus horas de silencio.",
  } as Record<string, string>,
  respond: { ACCEPTED: "Hacerlo ahora", POSTPONED: "Más tarde", DISMISSED: "No, gracias" },
  responded: { ACCEPTED: "Hecho", POSTPONED: "Pospuesto", DISMISSED: "Descartado" } as Record<string, string>,
  feedback: { HELPFUL: "Me sirvió", NOT_HELPFUL: "No me sirvió" },
  feedbackQuestion: "¿Te sirvió?",
  category: { BREATHING: "Respiración", CBT: "Pensamientos", PHYSICAL_BREAK: "Pausa física", OTHER: "Otro" } as Record<string, string>,
};

export const consentCopy: Record<string, { label: string; body: string }> = {
  CHECKIN: { label: "Check-ins", body: "Tus respuestas del 1 al 5 y su etiqueta. Base de tu línea personal." },
  CALENDAR: { label: "Calendario", body: "Minutos y cantidad de reuniones por día. Nunca títulos ni participantes." },
  IDE_GIT: { label: "Editor y Git", body: "Horas activas, minutos fuera de horario y racha más larga. Nunca código ni mensajes." },
  WEARABLE: { label: "Wearables", body: "Variabilidad cardíaca, pulso en reposo y sueño (plan Plus)." },
  DESKTOP: { label: "Agente de escritorio", body: "Horas activas, pausas, sesión continua más larga y trabajo fuera de horario, calculados en tu equipo. Nunca teclas, ventanas ni archivos." },
  SLEEP: { label: "Sueño", body: "Cómo dormiste y cuántas horas, si quieres contarlo tras tu primer check-in del día. Nunca se infiere de tu teléfono ni de tu equipo." },
  BIOMETRIC: { label: "Biométricos", body: "Reservado para mediciones futuras. Hoy no se recoge nada." },
};

export const deviceCopy = {
  platforms: { "desktop-tauri": "Agente de escritorio", vscode: "Extensión de VS Code", flutter: "App móvil" } as Record<string, string>,
  linkTitle: "Vincular un dispositivo",
  linkBody: "Abre la extensión o el agente, elige “Vincular con la web” y escribe aquí el código que te muestra.",
};
