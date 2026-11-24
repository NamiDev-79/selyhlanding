/**
 * Texto de la landing, en el orden en que aparece. Edita aquí sin tocar componentes.
 * Voz de la marca: calmada, cercana y honesta. Tuteamos, frases cortas, sin alarmas ni promesas médicas.
 * Palabras que sí: pausa, carga, ritmo, cuidarte, prevenir. Que no: paciente, trastorno, monitoreo, vigilancia.
 */

export const hero = {
  title: { lead: "Prevenir también es", accent: "parte del trabajo." },
  lead: "Selyh aprende tu ritmo y te avisa con calma cuando tu carga empieza a subir. Desde tu editor, tu escritorio o tu móvil, sin salir de tu flujo de trabajo.",
  primary: { label: "Crear cuenta gratis", href: "/registro" },
  secondary: { label: "Selyh para equipos", href: "#equipos" },
  trust: ["Gratis en lo esencial", "Nunca lee tu código", "Windows, macOS, Linux, iOS y Android"],
  /** Imagen de campaña (generada con Higgsfield): las barras del logo como esculturas monumentales. */
  art: { src: "/brand/hero-pausa.webp" },
};

/** Dónde vive Selyh: las cuatro piezas del producto. `get` = botones de descarga, cada uno con el logo de su plataforma. */
export const platforms = {
  title: { lead: "Vive donde ya", accent: "trabajas." },
  lead: "No es otra app que tengas que acordarte de abrir. Selyh aparece en las herramientas que ya usas y se sincroniza entre ellas.",
  items: [
    {
      id: "vscode",
      name: "Extensión de VS Code",
      body: "El check-in vive en la barra de estado. Aparece después de un commit, no en medio de una idea.",
      get: [
        { 
          icon: "vscode", kicker: "Instalar en", label: "VS Code", href: "https://marketplace.visualstudio.com/items?itemName=selyh.selyh",
        }
      ],
    },
    {
      id: "desktop",
      name: "Agente de escritorio",
      body: "Para quien no vive en un solo editor. Discreto en la bandeja, con horas de silencio y modo foco.",
      get: [
        {
          icon: "windows",
          kicker: "Descargar para",
          label: "Windows",
          href: "https://github.com/NamiDev-79/selyh-desktop/releases/download/Demo-Windows/Selyh_0.1.0_x64-setup.exe",
        },
        { icon: "apple", kicker: "Descargar para", label: "macOS", href: "#", disabled: true },
        { icon: "linux", kicker: "Descargar para", label: "Linux", href: "#", disabled: true },
      ],
    },
    {
      id: "mobile",
      name: "App móvil",
      body: "Responde una escala con calma o mira tu semana lejos de la pantalla de trabajo.",
      get: [
        {
          icon: "android",
          kicker: "Descargar APK",
          label: "Android (GitHub)",
          href: "https://github.com/NamiDev-79/selyhapp-mobile/releases/download/Demo-Mobile/SelyhApp_0.1.0.DEMO.apk",
        },
        { icon: "play", kicker: "Disponible en", label: "Google Play", href: "#", disabled: true },
        { icon: "apple", kicker: "Descárgala en", label: "App Store", href: "#", disabled: true },
      ],
    },
    {
      id: "web",
      name: "Panel web",
      body: "Tu historial, tus permisos y tus datos en un solo lugar.",
      get: [{ icon: "browser", kicker: "Abrir en", label: "tu navegador", href: "/login" }],
    },
  ],
};

/** Un día cualquiera: la jornada de ejemplo que recorre el control deslizante. Minutos desde las 00:00. */
export type DayMoment = {
  from: number;
  to: number;
  kind: "focus" | "meeting" | "incident" | "pause" | "off";
  label: string;
  /** Lo que hace Selyh en ese tramo. `asks` = aparece con una pregunta o sugerencia. */
  selyh: { asks: boolean; title: string; body: string };
};

export const workday = {
  title: { lead: "Aparece en tus pausas,", accent: "no en medio de tus ideas." },
  lead: "Selyh conoce la diferencia entre estar concentrado y estar agotado. Arrastra el día y mira cuándo habla y cuándo se queda en silencio.",
  scrubLabel: "Hora del día",
  play: "Reproducir el día",
  pauseLabel: "Pausar",
  note: "Jornada de ejemplo",
  moments: [
    { from: 510, to: 600, kind: "focus", label: "Foco", selyh: { asks: false, title: "Estás en foco", body: "Selyh espera en silencio. Ninguna notificación mientras escribes código." } },
    { from: 600, to: 640, kind: "meeting", label: "Daily", selyh: { asks: false, title: "Reunión en curso", body: "Durante tus reuniones no aparece nada." } },
    { from: 640, to: 655, kind: "pause", label: "Commit", selyh: { asks: true, title: "Acabas de hacer push. ¿Cómo vas?", body: "Un toque, del 1 al 5. Si no respondes, no vuelve a insistir." } },
    { from: 655, to: 790, kind: "incident", label: "Bug en producción", selyh: { asks: false, title: "Momento intenso", body: "Selyh nota la carga, pero no interrumpe un incidente." } },
    { from: 790, to: 850, kind: "off", label: "Almuerzo", selyh: { asks: false, title: "Fuera del teclado", body: "Tu pausa cuenta. Selyh la registra como descanso real." } },
    { from: 850, to: 960, kind: "focus", label: "Foco", selyh: { asks: false, title: "Estás en foco", body: "Silencio otra vez. El modo foco manda." } },
    { from: 960, to: 975, kind: "pause", label: "PR cerrado", selyh: { asks: true, title: "Llevas 2 h 40 min sin pausa", body: "¿Te estiras un minuto? Puedes decir que no: lo aprendemos." } },
    { from: 975, to: 1080, kind: "meeting", label: "Revisión de código", selyh: { asks: false, title: "Revisión en curso", body: "Nada que interrumpir." } },
    { from: 1080, to: 1095, kind: "pause", label: "Fin del día", selyh: { asks: true, title: "Cerraste el día. ¿Cómo te vas?", body: "Con esto Selyh entiende cómo terminan tus jornadas." } },
    { from: 1095, to: 1170, kind: "off", label: "Fuera de horario", selyh: { asks: false, title: "Tus horas de silencio", body: "Después de tu horario, Selyh no pregunta nada." } },
  ] satisfies DayMoment[],
};

/** Cómo te ayuda: notar, entender y pausar. */
export const how = {
  title: { lead: "Una pausa a tiempo también es", accent: "productividad." },
  lead: "Tres cosas, nada más. Las haces en segundos y Selyh hace el resto en silencio.",
  notice: {
    title: "Notar a tiempo",
    body: "Un check-in de un toque, una o dos veces al día. En 14 días Selyh conoce tu semana normal. Antes de eso te dice «calibrando» en lugar de inventar un número.",
    scaleLabel: "¿Cómo vas?",
    scale: ["Muy tranquilo", "Tranquilo", "Normal", "Cargado", "Muy cargado"],
    calibrating: "Conociendo tu ritmo",
    days: 14,
  },
  understand: {
    title: "Entender tu ritmo",
    body: "Te comparamos contigo, no con nadie más. Ves tu carga frente a tu rango habitual y cómo cambia semana a semana. Sin diagnósticos: estimados claros y honestos.",
    chartTitle: "Tu carga frente a tu rango habitual",
    band: "tu rango habitual",
    callout: "Tu carga viene subiendo",
    afterPause: "Volviste a tu ritmo",
    note: "Datos de ejemplo",
    levels: [
      { id: "calibrando", label: "Calibrando" },
      { id: "estable", label: "Estable" },
      { id: "aumento", label: "En aumento" },
      { id: "alta", label: "Alta" },
    ],
  },
  pause: {
    title: "Pausar lo justo",
    body: "Cuando tu carga sube, Selyh te propone algo de 1 a 5 minutos: respirar, moverte o reordenar un pensamiento. Como máximo dos al día, y puedes silenciarlo.",
    kinds: [
      { id: "breathe", name: "Respirar", minutes: 1, body: "Respiración en caja: inhala, sostén y exhala contando hasta 4. Baja el ritmo sin levantarte." },
      { id: "move", name: "Moverte", minutes: 3, body: "Estira cuello y espalda, camina un poco y toma agua. Vuelves con el cuerpo más suelto." },
      { id: "think", name: "Ordenar una idea", minutes: 5, body: "Escribe lo que te agobia y míralo con otra perspectiva. Útil antes de una entrega difícil." },
    ] as const,
    rules: ["Máximo 2 al día", "Nunca en reuniones", "Silénciala cuando quieras"],
  },
};

export const privacy = {
  title: { lead: "Tus datos son tuyos.", accent: "Tu código, intocable." },
  lead: "Selyh funciona con números que tú autorizas, fuente por fuente. Lo demás nunca sale de tu equipo.",
  neverLabel: "Lo que nunca vemos",
  never: ["Tu código", "Tus mensajes", "Tus teclas", "Tus archivos"],
  consentTitle: "Lo que sí llega, si tú quieres",
  consentNote: "Revocas un permiso y deja de usarse en el siguiente cálculo.",
  sources: [
    { id: "checkin", name: "Check-ins", sends: "Tu respuesta del 1 al 5", on: true },
    { id: "editor", name: "Actividad del editor", sends: "Horas activas: 6,4 h", on: true },
    { id: "desktop", name: "Escritorio", sends: "Pausas: 4 · Sesión más larga: 95 min", on: false },
    { id: "calendar", name: "Calendario", sends: "Reuniones: 3 h 10 min", on: false },
  ],
  off: "Nada",
  promises: [
    { title: "Exporta o borra todo", body: "Descarga tus datos o borra tu cuenta cuando quieras, como establece la Ley 29733." },
    { title: "Tu empresa no te ve a ti", body: "Solo ve tendencias de equipos de 5 personas o más. No existe una vista individual." },
    { title: "Ayuda humana primero", body: "Si una respuesta indica riesgo, te mostramos de inmediato líneas de ayuda reales." },
  ],
};

export type DemoTeam = { id: string; name: string; people: number; weeks: number[]; context: string[] };

export const teams = {
  title: { lead: "Cuida a tu equipo", accent: "sin vigilar a nadie." },
  lead: "El panel corporativo te muestra cómo va la carga de cada equipo para que actúes sobre las causas: guardias mal repartidas, semanas llenas de reuniones, deuda técnica que nadie prioriza. Nunca sobre personas.",
  points: [
    "Tendencias por equipo, desde 5 personas",
    "Sin vistas individuales, ni para administradores",
    "Registro de auditoría de cada acceso",
    "Invitaciones por correo y control de puestos",
  ],
  primary: { label: "Pedir una demo", href: "#contacto" },
  secondary: { label: "Ver plan corporativo", href: "#planes" },
  dashboard: {
    title: "Carga media por semana",
    note: "Datos de ejemplo",
    baseline: "rango habitual del equipo",
    minPeople: 5,
    locked: (n: number) => `${n} personas en este equipo. Los datos aparecen desde 5, para que nadie quede expuesto.`,
    contextLabel: "Lo que coincide con la subida",
    teams: [
      { id: "plataforma", name: "Plataforma", people: 12, weeks: [0.1, 0.0, 0.2, 0.1, 0.3, 0.7, 0.9, 0.8, 0.5, 0.3], context: ["3 semanas seguidas de guardias", "Migración de base de datos"] },
      { id: "pagos", name: "Pagos", people: 7, weeks: [0.2, 0.3, 0.2, 0.4, 0.3, 0.2, 0.3, 0.2, 0.1, 0.2], context: ["Carga estable", "Reuniones dentro de lo habitual"] },
      { id: "movil", name: "Móvil", people: 4, weeks: [], context: [] },
    ] satisfies DemoTeam[],
  },
};

export const science = {
  title: "Ciencia conocida, explicada sin jerga",
  quote: { lead: "Nuestro nombre es un homenaje a", accent: "Hans Selye", tail: ", pionero del estudio científico del estrés." },
  quoteLink: { label: "Conoce su historia", href: "/hans-selye" },
  lead: "No inventamos una métrica mágica. Usamos cuestionarios y modelos que la psicología valida desde hace años, y trabajamos de la mano con profesionales de la salud mental.",
  items: [
    { term: "WHO-5", body: "Cinco preguntas de la OMS sobre tu bienestar en las últimas dos semanas." },
    { term: "PSS-10", body: "Cuánto estrés has percibido en el último mes." },
    { term: "PHQ-9 y GAD-7", body: "Tamizajes breves de ánimo y ansiedad. Orientan, no diagnostican." },
    { term: "Demandas y recursos", body: "El estrés crece cuando lo que pide el trabajo supera el tiempo, el apoyo y la autonomía que tienes." },
  ],
  limits: {
    title: "Lo que Selyh no es",
    body: "No es un dispositivo médico, no diagnostica y no reemplaza a un profesional. Te ayuda a notar a tiempo y, si hace falta, a buscar ayuda humana.",
  },
};

export const pricing = {
  title: { lead: "Lo esencial es gratis.", accent: "Siempre." },
  lead: "Check-ins, tu panel, las escalas, los ejercicios y la ayuda en crisis están completos en el plan gratuito. Lo de pago suma; nunca recorta lo básico.",
  currency: "USD",
  seats: { label: "Puestos", min: 5, max: 200, default: 12, total: "Total al mes" },
  featured: "Más elegido",
};

export const contact = {
  title: { lead: "¿Tienes un equipo?", accent: "Hablemos." },
  lead: "Te mostramos el panel corporativo con datos de ejemplo y diseñamos contigo un piloto de 8 semanas con tu equipo.",
  facts: ["Respuesta en 1 día hábil", "Demo de 30 minutos", "Sin compromiso"],
  tabs: {
    DEMO: { label: "Demo para empresas", submit: "Pedir demo" },
    CONTACT: { label: "Otra consulta", submit: "Enviar mensaje" },
  },
  success: { title: "Recibido.", body: "Gracias por escribirnos. Te respondemos en un día hábil." },
};

export const finalCta = {
  title: "Tu ritmo empieza con el primer check-in",
  body: "Crea tu cuenta gratis. En dos semanas sabrás cómo es tu semana normal, y Selyh podrá avisarte cuando deje de serlo.",
  primary: { label: "Crear cuenta gratis", href: "/registro" },
  secondary: { label: "Pedir una demo para mi equipo", href: "#contacto" },
};
