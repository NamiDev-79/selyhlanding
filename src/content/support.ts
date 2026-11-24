/** Página de soporte técnico (/support). Edita aquí los temas y las respuestas. */
export type SupportItem = { q: string; a: string; href?: string; cta?: string };

export const support = {
  title: "Soporte técnico",
  description: "Soluciones rápidas para tu cuenta, la app de escritorio, la extensión de VS Code y el móvil, y cómo escribirnos si algo no funciona.",
  lead: "Casi todo se resuelve en un minuto. Busca tu caso abajo y, si no aparece, escríbenos.",
  mailSubject: "Soporte técnico",
  /** Lo que conviene incluir en el correo para resolver a la primera. */
  checklist: [
    "Dónde pasa: web, escritorio (Windows), VS Code o móvil, y su versión si la ves.",
    "Qué hiciste, qué esperabas y qué pasó.",
    "Una captura, si ayuda. Tapa cualquier dato personal.",
  ],
  privacyNote: "Nunca te pediremos tu contraseña ni tus respuestas de check-ins o escalas.",
  topics: [
    {
      id: "cuenta",
      title: "Cuenta y acceso",
      items: [
        {
          q: "No me llega el correo de confirmación",
          a: "Revisa la carpeta de spam o promociones. Si pasaron unos minutos, pide un enlace nuevo con “Reenviar enlace”. Cada enlace nuevo invalida el anterior: usa siempre el último.",
        },
        {
          q: "Olvidé mi contraseña",
          a: "Entra a “¿Olvidaste tu contraseña?” en la pantalla de inicio de sesión y sigue el enlace que te llega por correo.",
          href: "/recuperar",
          cta: "Recuperar contraseña",
        },
        {
          q: "¿Cómo vinculo un dispositivo nuevo?",
          a: "Desde la app o la extensión elige “Vincular cuenta”. Se abre selyh.fun/device con un código: inicia sesión y apruébalo. El código vence a los 10 minutos; si venció, vuelve a empezar. Tus dispositivos están en Panel → Dispositivos.",
        },
      ],
    },
    {
      id: "escritorio",
      title: "App de escritorio (Windows)",
      items: [
        {
          q: "Windows dice que la app podría ser peligrosa",
          a: "Es el aviso de SmartScreen para apps nuevas que aún no tienen reputación. Elige “Más información” y luego “Ejecutar de todas formas”. Descarga el instalador solo desde selyh.fun o nuestro GitHub oficial.",
        },
        {
          q: "No me aparece ningún check-in",
          a: "Selyh solo aparece en pausas naturales y nunca en tus horas de silencio, con el agente en pausa o en pantalla completa. Revisa el icono de la bandeja: si está en pausa, reanúdalo. También puedes hacer un check-in cuando quieras desde ese icono.",
        },
        {
          q: "Hice check-ins sin internet",
          a: "Se guardan en tu equipo y se envían solos cuando vuelve la conexión, sin duplicados. Si un check-in queda esperando permiso, actívalo en Privacidad.",
        },
      ],
    },
    {
      id: "vscode",
      title: "Extensión de VS Code",
      items: [
        {
          q: "¿Cómo la instalo?",
          a: "Búscala como “Selyh” en la vista de Extensiones, o instala el archivo .vsix desde Extensiones → ⋯ → Instalar desde VSIX. Luego haz clic en “Selyh” en la barra de estado y elige “Vincular cuenta”.",
        },
        {
          q: "¿Qué envía la extensión?",
          a: "Tus check-ins y, solo si lo activas, tres números por día: horas activas, minutos fuera de horario y racha más larga. Nunca código, archivos ni teclas. El comando “Selyh: Qué se envía hoy” te lo muestra exactamente.",
        },
        {
          q: "Me pregunta demasiado (o nunca)",
          a: "En el menú de Selyh de la barra de estado puedes pausar los avisos, activar el modo foco (solo pausas naturales) o definir horas de silencio. Si nunca aparece, revisa que la cuenta esté vinculada.",
        },
      ],
    },
    {
      id: "movil",
      title: "App móvil",
      items: [
        {
          q: "No me llegan los recordatorios",
          a: "Activa las notificaciones de Selyh en los ajustes del teléfono. En Android, quita Selyh del ahorro de batería: algunos fabricantes detienen las apps en segundo plano. Comprueba también que los recordatorios estén activos en tu perfil y que no caigan en tus horas de silencio.",
        },
        {
          q: "La app dice que estoy sin conexión",
          a: "Puedes seguir respondiendo: tus check-ins se guardan y se envían solos al volver la señal. Si la conexión está bien y el aviso sigue, cierra y abre la app.",
        },
      ],
    },
    {
      id: "datos",
      title: "Datos y privacidad",
      items: [
        {
          q: "Quiero descargar o borrar mis datos",
          a: "En Panel → Privacidad puedes descargar todos tus datos en JSON o borrar tu cuenta de forma definitiva. Ahí mismo activas o revocas cada fuente de datos.",
          href: "/panel/privacidad",
          cta: "Ir a Privacidad",
        },
        {
          q: "Mi empresa no ve los datos de mi equipo",
          a: "Es a propósito: el panel corporativo solo muestra promedios de equipos con 5 personas o más, por cada métrica. Con menos personas no se muestra nada, para proteger a cada quien.",
        },
      ],
    },
  ] satisfies { id: string; title: string; items: SupportItem[] }[],
};
