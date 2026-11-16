/**
 * Textos de privacidad y términos. Son un BORRADOR para revisar con asesoría legal antes de publicar.
 */
export type LegalDoc = { title: string; description: string; updated: string; sections: { h: string; p: string[] }[] };

export const privacyPolicy: LegalDoc = {
  title: "Política de privacidad",
  description: "Qué datos recoge Selyh, para qué los usa y cómo puedes exportarlos o borrarlos.",
  updated: "noviembre de 2026",
  sections: [
    {
      h: "Qué datos recogemos",
      p: [
        "Los que tú nos das: nombre, correo, zona horaria, tus check-ins (un número del 1 al 5 y una etiqueta opcional) y tus respuestas a escalas.",
        "Los que tú autorizas por fuente: índices numéricos del editor o del calendario (por ejemplo, horas activas o minutos en reuniones) y métricas de wearables. Nunca recogemos código, mensajes, teclas ni nombres de archivos.",
      ],
    },
    {
      h: "Para qué los usamos",
      p: [
        "Para calcular tu línea base personal, tu carga y su tendencia, y para sugerirte ejercicios breves. No vendemos tus datos ni los usamos para publicidad.",
        "Si una respuesta indica posible riesgo, te mostramos recursos de ayuda. Esa información no se comparte con ninguna empresa.",
      ],
    },
    {
      h: "Qué ve tu empresa",
      p: [
        "Si tu empresa usa Selyh, solo ve promedios de equipos con 5 personas o más por cada métrica. No existe una vista de datos individuales. Cada acceso al panel corporativo queda en un registro de auditoría.",
      ],
    },
    {
      h: "Tus derechos",
      p: [
        "Puedes activar o revocar cada fuente de datos, descargar todos tus datos y borrar tu cuenta desde la sección Privacidad de tu panel, conforme a la Ley 29733 de Protección de Datos Personales del Perú.",
      ],
    },
    { h: "Contacto", p: ["Escríbenos a hola@selyh.fun para cualquier consulta sobre tus datos."] },
  ],
};

export const terms: LegalDoc = {
  title: "Términos de uso",
  description: "Condiciones para usar Selyh, sus límites y lo que no es.",
  updated: "noviembre de 2026",
  sections: [
    {
      h: "Qué es Selyh",
      p: [
        "Selyh es una herramienta de bienestar para personas que trabajan en software. Muestra tendencias y sugiere ejercicios breves.",
        "Selyh no es un dispositivo médico, no ofrece diagnósticos y no reemplaza la atención de un profesional de salud mental.",
      ],
    },
    {
      h: "Tu cuenta",
      p: ["Eres responsable de mantener segura tu contraseña. Puedes cerrar sesiones abiertas y borrar tu cuenta cuando quieras."],
    },
    {
      h: "Planes y pagos",
      p: [
        "Los precios publicados son referenciales. Mientras no habilitemos la pasarela de pago, los planes de pago se activan sin cobro. Te avisaremos antes de empezar a cobrar.",
      ],
    },
    {
      h: "En situaciones de crisis",
      p: ["Si estás en peligro o en crisis, comunícate con la Línea 113 (opción 5), el SAMU (106) o acude a un servicio de emergencias. Selyh no atiende emergencias."],
    },
  ],
};
