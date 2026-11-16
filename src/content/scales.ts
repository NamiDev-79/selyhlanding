/**
 * Textos de la pantalla de escalas. El texto de cada cuestionario (instrucción, opciones e ítems) NO
 * vive aquí: lo escribe y aprueba el personal clínico en el panel clínico y llega desde la API
 * (`GET /scales` → `text`). Una escala sin texto aprobado aparece como «Próximamente».
 */
export const scalesCopy = {
  title: "Escalas",
  accent: "validadas",
  lead: "Cuestionarios que usan los profesionales de salud mental. Los respondes por partes, unas pocas preguntas a la vez, y sirven de referencia para ver si algo cambia con el tiempo.",
  start: "Empezar",
  resume: "Continuar",
  again: "Responder de nuevo",
  restart: "Empezar de nuevo",
  save: "Guardar y seguir",
  saveLast: "Guardar respuestas",
  finish: "Ver mi resultado",
  later: "Seguir más tarde",
  saved: "Guardado. Puedes seguir ahora o más tarde.",
  last: "Última vez",
  never: "Aún no la respondes",
  soon: "Próximamente",
  soonNote: "El equipo clínico está preparando esta escala.",
  allAnswered: "Respondiste todas las preguntas.",
  resultNote: "Es una referencia, no un diagnóstico. Si algo te preocupa, habla con un profesional.",
  privacy: "Tus respuestas son privadas. Tu empresa nunca las ve.",
  back: "Volver a las escalas",
};
